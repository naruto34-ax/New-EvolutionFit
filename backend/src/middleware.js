const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'La autenticación no está configurada.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'La sesión no es válida. Inicia sesión nuevamente.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) =>
    roles.includes(req.user?.role)
      ? next()
      : res.status(403).json({ error: "No tienes permisos para esta acción." });
}

module.exports = { authenticateToken, requireRole };

