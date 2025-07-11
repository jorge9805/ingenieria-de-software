import express from 'express'
import db from '../db.js'
import verifyToken, { optionalAuth } from '../middleware/auth.js'
const router = express.Router()

// Obtener todos los posts con rating y favorite flag
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    
    const result = await db.query(`
      SELECT p.*, u.username AS user_name,
             ROUND(AVG(c.rating),1) AS average_rating,
             CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN comments c ON c.post_id = p.id
      LEFT JOIN favorites f ON f.post_id = p.id AND f.user_id = ?
      GROUP BY p.id, p.title, p.description, p.image_url, p.user_id, p.created_at, u.username, f.id
      ORDER BY p.created_at DESC
    `, [userId])
    
    // Convertir is_favorite de número a boolean
    const posts = result.rows.map(row => ({
      ...row,
      is_favorite: Boolean(row.is_favorite)
    }))
    
    res.json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener los posts' })
  }
})

// Obtener mis posts
router.get('/my', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.username AS user_name,
              ROUND(AVG(c.rating),1) AS average_rating,
              CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN comments c ON c.post_id = p.id
       LEFT JOIN favorites f ON f.post_id = p.id AND f.user_id = ?
       WHERE p.user_id = ?
       GROUP BY p.id, p.title, p.description, p.image_url, p.user_id, p.created_at, u.username, f.id
       ORDER BY p.created_at DESC`,
      [req.user.id, req.user.id]
    )
    
    // Convertir is_favorite de número a boolean
    const posts = result.rows.map(row => ({
      ...row,
      is_favorite: Boolean(row.is_favorite)
    }))
    
    res.json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener mis posts' })
  }
})

// Obtener post por id con comentarios
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = (await db.query(
      `SELECT p.*, u.username AS user_name,
              ROUND(AVG(c.rating),1) AS average_rating
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN comments c ON c.post_id = p.id
       WHERE p.id = ?
       GROUP BY p.id, u.username`,
      [id]
    )).rows[0]

    const comments = (await db.query(
      `SELECT c.*, u.username AS user_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE post_id = ?
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
    const result = await db.query(
      `INSERT INTO posts (user_id, title, description, image_url)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, title, description, image_url]
    )
    
    // Obtener el post recién creado
    const newPost = (await db.query(
      `SELECT p.*, u.username AS user_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [result.insertId]
    )).rows[0]
    
    res.status(201).json(newPost)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo crear el post' })
  }
})

// Eliminar post
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  try {
    await db.query(`DELETE FROM posts WHERE id = ? AND user_id = ?`, [id, req.user.id])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo eliminar el post' })
  }
})

export default router

