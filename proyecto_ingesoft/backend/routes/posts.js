import express from 'express'
import pool from '../db.js'
import verifyToken from '../middleware/auth.js'
const router = express.Router()

// Obtener todos los posts con rating y favorite flag
router.get('/', async (req, res) => {
  try {
    let userId = null;
    
    // Si hay token, intentar extraer el userId
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = (await import('jsonwebtoken')).default;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
        userId = decoded.id;
      } catch (tokenError) {
        console.log('Token inválido, continuando sin userId');
      }
    }
    
    const result = await pool.query(`
      SELECT p.*, u.name AS user_name,
             ROUND(AVG(c.rating),1) AS average_rating,
             CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_favorite
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN comments c ON c.post_id = p.id
      LEFT JOIN favorites f ON f.post_id = p.id AND f.user_id = $1
      GROUP BY p.id, u.name, f.id
      ORDER BY p.created_at DESC
    `, [userId])
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener los posts' })
  }
})

// Obtener mis posts
router.get('/my', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS user_name,
              ROUND(AVG(c.rating),1) AS average_rating,
              CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_favorite
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN comments c ON c.post_id = p.id
       LEFT JOIN favorites f ON f.post_id = p.id AND f.user_id = $1
       WHERE p.user_id = $1
       GROUP BY p.id, u.name, f.id
       ORDER BY p.created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener mis posts' })
  }
})

// Obtener post por id con comentarios
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = (await pool.query(
      `SELECT p.*, u.name AS user_name,
              ROUND(AVG(c.rating),1) AS average_rating
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN comments c ON c.post_id = p.id
       WHERE p.id = $1
       GROUP BY p.id, u.name`,
      [id]
    )).rows[0]

    const comments = (await pool.query(
      `SELECT c.*, u.name AS user_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE post_id = $1
       ORDER BY c.created_at`,
      [id]
    )).rows

    post.comments = comments
    res.json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener el post' })
  }
})

// Crear post
router.post('/', verifyToken, async (req, res) => {
  const { title, description, image_url } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, title, description, image_url)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.user.id, title, description, image_url]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo crear el post' })
  }
})

// Eliminar post
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(`DELETE FROM posts WHERE id = $1 AND user_id = $2`, [id, req.user.id])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo eliminar el post' })
  }
})

export default router

