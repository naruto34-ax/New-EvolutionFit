require('dotenv').config({ path: '../.env' });
const pool = require('../config/connection');

async function seedCoaches() {
  try {
    console.log('🔄 Conectando a Neon para poblar coaches...');

    // 1. Crear la tabla coaches si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coaches (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL UNIQUE
      );
    `);

    // 2. Insertar los 5 coaches oficiales
    const coachesList = [
      { id: 1, name: 'María', email: 'maria@evolutionfit.com' },
      { id: 2, name: 'Carlos', email: 'carlos@evolutionfit.com' },
      { id: 3, name: 'Luis', email: 'luis@evolutionfit.com' },
      { id: 4, name: 'Xiomara', email: 'xiomara@evolutionfit.com' },
      { id: 5, name: 'CBoom', email: 'cboom@evolutionfit.com' }
    ];

    for (const coach of coachesList) {
      await pool.query(
        `INSERT INTO coaches (id, name, email) 
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE 
         SET name = EXCLUDED.name, email = EXCLUDED.email`,
        [coach.id, coach.name, coach.email]
      );
    }

    // 3. Asegurar que la tabla users tenga la columna coach_id vinculada
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS coach_id INTEGER REFERENCES coaches(id);
    `);

    console.log('✅ ¡Los 5 coaches y la estructura fueron agregados a Neon con éxito!');
  } catch (err) {
    console.error('❌ Error al poblar coaches:', err.message);
  } finally {
    process.exit(0);
  }
}

seedCoaches();