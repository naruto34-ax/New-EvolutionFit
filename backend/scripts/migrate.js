require('dotenv').config();

const fs = require('node:fs/promises');
const path = require('node:path');
const pool = require('../config/connection');

async function migrate() {
  let client;

  try {
    const migrationsDirectory = path.join(__dirname, '../db/migrations');
    const migrationFiles = (await fs.readdir(migrationsDirectory))
      .filter((file) => /^\d+_.+\.sql$/.test(file))
      .sort();
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    for (const file of migrationFiles) {
      const { rowCount } = await client.query(
        'SELECT 1 FROM schema_migrations WHERE version = $1',
        [file]
      );

      if (rowCount > 0) {
        continue;
      }

      const sql = await fs.readFile(
        path.join(migrationsDirectory, file),
        'utf8'
      );

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`Migración aplicada: ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log('Esquema PostgreSQL actualizado.');
  } catch (error) {
    console.error('No se pudo aplicar el esquema PostgreSQL:', error.message);
    process.exitCode = 1;
  } finally {
    client?.release();
    await pool.end();
  }
}

migrate();
