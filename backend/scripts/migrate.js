require('dotenv').config();

const fs = require('node:fs/promises');
const path = require('node:path');
const pool = require('../config/connection');

async function migrate() {
  let client;

  try {
    const migrationPath = path.join(
      __dirname,
      '../db/migrations/001_initial_schema.sql'
    );
    const sql = await fs.readFile(migrationPath, 'utf8');

    client = await pool.connect();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    console.log('Esquema PostgreSQL aplicado correctamente.');
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // Preserve the original migration error.
      }
    }

    console.error('No se pudo aplicar el esquema PostgreSQL:', error.message);
    process.exitCode = 1;
  } finally {
    client?.release();
    await pool.end();
  }
}

migrate();
