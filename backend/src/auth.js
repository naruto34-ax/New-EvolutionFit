
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/connection');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      gender,
      population,
      preferredSpace,
      level,
      password
    } = req.body;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      return res.status(400).json({
        error: 'Nombre, correo y contraseña son obligatorios.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener mínimo 6 caracteres.'
      });
    }

    if (password.length > 72) {
      return res.status(400).json({
        error: 'La contraseña es demasiado larga.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { rows: existing } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        error: 'Este correo ya está registrado.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { rows: insertedUsers } = await pool.query(
      `INSERT INTO users
      (name, email, password_hash, age, gender, population, preferred_space, level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [
        name.trim(),
        normalizedEmail,
        passwordHash,
        age !== '' && age != null ? Number(age) : null,
        gender || null,
        population || 'general',
        preferredSpace || 'gym',
        level || 'beginner'
      ]
    );

    return res.status(201).json({
      message: 'Usuario registrado correctamente.',
      user: {
        id: insertedUsers[0].id,
        name: name.trim(),
        email: normalizedEmail,
        role: 'user'
      }
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Este correo ya está registrado.'
      });
    }

    console.error('Error al registrar usuario:', error.message);

    return res.status(500).json({
      error: 'No se pudo registrar el usuario.'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      return res.status(400).json({
        error: 'Correo y contraseña son obligatorios.'
      });
    }

    const { rows: users } = await pool.query(
      `SELECT id, name, email, password_hash, role
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Correo o contraseña incorrectos.'
      });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        error: 'Correo o contraseña incorrectos.'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('Falta JWT_SECRET en el archivo .env');

      return res.status(500).json({
        error: 'La autenticación no está configurada.'
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);

    return res.status(500).json({
      error: 'No se pudo iniciar sesión.'
    });
  }
});

module.exports = router;
