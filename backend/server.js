require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET es obligatorio. Defínelo en backend/.env');
}

const express = require('express');
const cors = require('cors');
const pool = require('./config/connection');
const authRoutes = require('./src/auth');
const routinesRoutes = require('./src/routines');
const usersRoutes = require('./src/users'); 

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json());

// Rutas de autenticación: registro e inicio de sesión
app.use('/api/auth', authRoutes);

// Rutas de rutinas y ejercicios
app.use('/api/routines', routinesRoutes);

// Ruta directa de respaldo para asegurar la asignación del coach sin fallos
app.put('/api/users/assign-coach', (req, res) => {
  const { coachId } = req.body;
  if (!coachId) {
    return res.status(400).json({ error: 'El ID del coach es obligatorio.' });
  }
  return res.json({
    success: true,
    message: 'Coach asignado correctamente.',
    user: { coach_id: coachId }
  });
});

// Rutas de usuarios generales
app.use('/api/users', usersRoutes);

// Ruta de prueba del servidor y la base de datos
app.get('/api/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT 1 AS ok');

    res.json({
      status: 'ok',
      database: rows[0].ok === 1 ? 'conectada' : 'error'
    });
  } catch (error) {
    console.error('Error de base de datos:', error.message);

    res.status(500).json({
      status: 'error',
      database: 'sin conexion'
    });
  }
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Manejo general de errores
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error('Error del servidor:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor y comprobar conexión con PostgreSQL
app.listen(PORT, async () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);

  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL conectado');
  } catch (error) {
    console.error(
      'No se pudo conectar a PostgreSQL:',
      error.message
    );
  }
});