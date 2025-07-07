import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'secreto';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hash]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, name: user.name }, SECRET, { expiresIn: '2h' });
    
    res.status(201).json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo registrar el usuario' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, name: user.name }, SECRET, { expiresIn: '2h' });
    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

export default router;
