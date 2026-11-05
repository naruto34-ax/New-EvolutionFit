const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'No se proporcionó un token de autorización.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos { id, role } en la petición
    next(); // Permite que la ruta continúe
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

module.exports = { verifyToken };