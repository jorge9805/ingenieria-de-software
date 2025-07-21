import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'secreto';

// Middleware que requiere autenticación
export default function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // puedes usar req.user.id y req.user.username
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

// Alias para authenticate
export const authenticate = verifyToken;

// Middleware opcional que extrae usuario si está autenticado
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (err) {
    // Token inválido, continuar sin usuario
    req.user = null;
  }
  
  next();
}
