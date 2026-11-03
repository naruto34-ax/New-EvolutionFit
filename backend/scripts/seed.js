require('dotenv').config();
const pool = require('../config/connection');

async function seedExercises() {
  try {
    await pool.query(`
      INSERT INTO exercises (name, description, category, space, level, muscle) VALUES
      ('Flexiones de pecho', 'Empuje corporal', 'strength', 'gym', 'beginner', 'Pecho'),
      ('Sentadillas libres', 'Flexión de rodillas', 'strength', 'gym', 'beginner', 'Piernas'),
      ('Plancha isométrica', 'Tensión abdominal', 'strength', 'gym', 'beginner', 'Abdomen'),
      ('Curl con mancuernas', 'Flexión de codo', 'strength', 'gym', 'beginner', 'Brazos'),
      ('Trote en cinta', 'Cardio moderado', 'cardio', 'gym', 'beginner', 'Piernas')
    `);
    console.log('✅ Ejercicios de prueba agregados a Neon PostgreSQL.');
  } catch (err) {
    console.error('Error insertando ejercicios:', err.message);
  } finally {
    process.exit(0);
  }
}

seedExercises();