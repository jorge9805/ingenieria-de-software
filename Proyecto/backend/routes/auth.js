import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'secreto';

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    
    // Insertar usuario en SQLite
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash]
    );
    
    // Obtener el usuario recién creado usando el insertId
    const userResult = await db.query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [result.insertId]
    );
    
    const user = userResult.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      token 
    });
  } catch (err) {
    console.error('Error en /register:', err);
    if (err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'El usuario o email ya existe' });
    } else {
      res.status(500).json({ error: 'No se pudo registrar el usuario' });
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username, id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

export default router;
