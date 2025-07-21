import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';

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
    if (result.rows.length === 0) {return res.status(401).json({ error: 'Usuario no encontrado' });}

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {return res.status(401).json({ error: 'Contraseña incorrecta' });}

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username, id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    res.json(user);
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error al obtener información del usuario' });
  }
});

// Ruta para actualizar el perfil del usuario autenticado
router.put('/update-profile', authenticate, async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;

  try {
    // Validaciones básicas
    if (!username || !email) {
      return res.status(400).json({ error: 'Nombre de usuario y email son obligatorios' });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'El nombre de usuario debe tener entre 3 y 30 caracteres' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Verificar si el usuario existe
    const userResult = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    // Verificar si el nuevo username o email ya están en uso por otro usuario
    if (username !== user.username) {
      const usernameCheck = await db.query(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, req.user.id]
      );
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      }
    }

    if (email !== user.email) {
      const emailCheck = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
    }

    // Si se quiere cambiar la contraseña
    let hashedNewPassword = user.password; // Por defecto mantener la misma
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Debes proporcionar tu contraseña actual para cambiarla' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
      }

      // Verificar contraseña actual
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
      }

      // Hash de la nueva contraseña
      hashedNewPassword = await bcrypt.hash(newPassword, 10);
    }

    // Actualizar usuario
    await db.query(
      'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
      [username, email, hashedNewPassword, req.user.id]
    );

    // Obtener el usuario actualizado
    const updatedResult = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    const updatedUser = updatedResult.rows[0];

    // Generar nuevo token si cambió el username
    let newToken = null;
    if (username !== user.username) {
      newToken = jwt.sign({ id: updatedUser.id, username: updatedUser.username }, SECRET, { expiresIn: '7d' });
    }

    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser,
      ...(newToken && { token: newToken })
    });

  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'El usuario o email ya existe' });
    } else {
      res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
  }
});

export default router;
