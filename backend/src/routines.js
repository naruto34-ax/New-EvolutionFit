
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/connection');

const router = express.Router();

const validSpaces = ['gym', 'park', 'home'];
const validLevels = ['beginner', 'intermediate', 'advanced'];
const validCategories = [
  'hiit',
  'strength',
  'cardio',
  'flexibility',
  'calisthenics'
];

// Verificar el token de inicio de sesión
function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      error: 'Debes iniciar sesión para acceder a las rutinas.'
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      error: 'La autenticación no está configurada.'
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      error: 'La sesión no es válida. Inicia sesión nuevamente.'
    });
  }
}

// Todas las rutas de este archivo requieren autenticación
router.use(authenticateToken);

// GET /api/routines/exercises
// Consultar ejercicios disponibles con filtros opcionales
router.get('/exercises', async (req, res) => {
  try {
    const { space, level, category } = req.query;

    if (space && !validSpaces.includes(space)) {
      return res.status(400).json({
        error: 'El espacio seleccionado no es válido.'
      });
    }

    if (level && !validLevels.includes(level)) {
      return res.status(400).json({
        error: 'El nivel seleccionado no es válido.'
      });
    }

    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        error: 'La categoría seleccionada no es válida.'
      });
    }

    const conditions = [];
    const values = [];

    if (space) {
      conditions.push('space = ?');
      values.push(space);
    }

    if (level) {
      conditions.push('level = ?');
      values.push(level);
    }

    if (category) {
      conditions.push('category = ?');
      values.push(category);
    }

    const where = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const [exercises] = await pool.execute(
      `SELECT id, name, description, category, space,
              level, muscle, video_url
       FROM exercises
       ${where}
       ORDER BY name`,
      values
    );

    return res.json({
      total: exercises.length,
      exercises
    });
  } catch (error) {
    console.error('Error al consultar ejercicios:', error.message);

    return res.status(500).json({
      error: 'No se pudieron consultar los ejercicios.'
    });
  }
});

// POST /api/routines/generate
// Generar y guardar una rutina automáticamente
router.post('/generate', async (req, res) => {
  const {
    name,
    description,
    space,
    level,
    category,
    population = 'general',
    duration = 30
  } = req.body;

  if (
    !validSpaces.includes(space) ||
    !validLevels.includes(level) ||
    !validCategories.includes(category)
  ) {
    return res.status(400).json({
      error: 'Selecciona un espacio, nivel y categoría válidos.'
    });
  }

  if (
    !Number.isInteger(Number(duration)) ||
    Number(duration) < 10 ||
    Number(duration) > 120
  ) {
    return res.status(400).json({
      error: 'La duración debe estar entre 10 y 120 minutos.'
    });
  }

  // Esta primera versión genera rutinas generales.
  if (population !== 'general' && population !== 'joven'
      && population !== 'adulto') {
    return res.status(400).json({
      error: 'Esta población requiere una selección de ejercicios específica que aún no está implementada.'
    });
  }

  const levelOrder = {
    beginner: ['beginner'],
    intermediate: ['beginner', 'intermediate'],
    advanced: ['beginner', 'intermediate', 'advanced']
  };

  let connection;

  try {
    const allowedLevels = levelOrder[level];
    const placeholders = allowedLevels.map(() => '?').join(', ');

    const [availableExercises] = await pool.execute(
      `SELECT id, name, category, space, level, muscle
       FROM exercises
       WHERE space = ?
         AND category = ?
         AND level IN (${placeholders})
       ORDER BY RAND()
       LIMIT 50`,
      [space, category, ...allowedLevels]
    );

    if (availableExercises.length === 0) {
      return res.status(422).json({
        error: 'Todavía no hay ejercicios compatibles. Agrega ejercicios al catálogo de MySQL e inténtalo de nuevo.'
      });
    }

    // Aproximadamente un ejercicio por cada 8 minutos,
    // con un mínimo de 3 y un máximo de 10.
    const exerciseCount = Math.min(
      10,
      Math.max(3, Math.round(Number(duration) / 8))
    );

    const selectedExercises = availableExercises.slice(
      0,
      Math.min(exerciseCount, availableExercises.length)
    );

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const routineName =
      typeof name === 'string' && name.trim()
        ? name.trim().slice(0, 150)
        : `Rutina ${category} - ${space}`;

    const routineDescription =
      typeof description === 'string' && description.trim()
        ? description.trim()
        : 'Rutina generada automáticamente según tus preferencias.';

    const [routineResult] = await connection.execute(
      `INSERT INTO routines
       (user_id, name, description, space, level, category,
        population, duration, is_public, is_generated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE, TRUE)`,
      [
        req.user.id,
        routineName,
        routineDescription,
        space,
        level,
        category,
        population,
        Number(duration)
      ]
    );

    const routineId = routineResult.insertId;

    for (let i = 0; i < selectedExercises.length; i++) {
      const exercise = selectedExercises[i];

      await connection.execute(
        `INSERT INTO routine_exercises
         (routine_id, exercise_id, position, sets, reps, rest_seconds)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          routineId,
          exercise.id,
          i + 1,
          level === 'beginner' ? 2 : 3,
          level === 'beginner' ? '8-10' : '10-12',
          60
        ]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Rutina generada y guardada correctamente.',
      routine: {
        id: routineId,
        name: routineName,
        description: routineDescription,
        space,
        level,
        category,
        population,
        duration: Number(duration),
        exercises: selectedExercises.map((exercise, index) => ({
          ...exercise,
          position: index + 1,
          sets: level === 'beginner' ? 2 : 3,
          reps: level === 'beginner' ? '8-10' : '10-12',
          restSeconds: 60
        }))
      }
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error('Error al generar rutina:', error.message);

    return res.status(500).json({
      error: 'No se pudo generar la rutina.'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// GET /api/routines/mine
// Consultar las rutinas del usuario autenticado
router.get('/mine', async (req, res) => {
  try {
    const [routines] = await pool.execute(
      `SELECT id, name, description, space, level, category,
              population, duration, is_public, is_generated, created_at
       FROM routines
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.json({
      total: routines.length,
      routines
    });
  } catch (error) {
    console.error('Error al consultar rutinas:', error.message);

    return res.status(500).json({
      error: 'No se pudieron consultar tus rutinas.'
    });
  }
});

module.exports = router;
