const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/connection');

const router = express.Router();

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'No se proporcionó un token de autorización.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

// GET /api/users/coaches - Únicamente CBoom disponible
router.get('/coaches', (req, res) => {
  const coaches = [
    { id: 'coach-cboom', name: 'CBoom', email: 'cboom@evolutionfit.com' }
  ];
  return res.json({ success: true, coaches });
});

// PUT /api/users/assign-coach
router.put('/assign-coach', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { coachId } = req.body;

    if (!coachId) {
      return res.status(400).json({ error: 'El ID del coach es obligatorio.' });
    }

    const { rows: updatedUsers } = await pool.query(
      `UPDATE users 
       SET coach_id = $1 
       WHERE id = $2 
       RETURNING id, name, email, coach_id`,
      [coachId, userId]
    );

    if (updatedUsers.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    return res.json({
      success: true,
      message: 'Coach asignado correctamente.',
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error('Error al asignar coach:', error.message);
    return res.status(500).json({ error: 'No se pudo asignar el coach.' });
  }
});

module.exports = router;