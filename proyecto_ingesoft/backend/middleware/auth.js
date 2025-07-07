import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'secreto';

export default function verifyToken(req, res, next) {
  console.log('Middleware auth ejecutándose para:', req.url); // Debug log
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Token no proporcionado o formato incorrecto'); // Debug log
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token recibido:', token ? 'Present' : 'Missing'); // Debug log

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log('Token verificado para usuario:', decoded.id, decoded.name); // Debug log
    req.user = decoded; // puedes usar req.user.id y req.user.name
    next();
  } catch (err) {
    console.log('Error verificando token:', err.message); // Debug log
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
