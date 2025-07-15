import express from 'express'
import db from '../db.js'
import verifyToken from '../middleware/auth.js'
const router = express.Router()

// Endpoint de prueba para verificar conectividad
router.get('/test', verifyToken, async (req, res) => {
  try {
    const testResult = await db.query('SELECT 1 as test');
    res.json({ message: 'OK', user: req.user.id, dbTest: testResult.rows[0] });
  } catch (err) {
    console.error('Test endpoint error:', err);
    res.status(500).json({ error: 'Test failed', details: err.message });
  }
})

// Listar favoritos del usuario
router.get('/', verifyToken, async (req, res) => {
  try {
    // Consulta que incluye el cálculo de rating promedio
    const result = await db.query(
      `SELECT p.id as post_id, p.title, p.description, p.image_url, p.created_at, p.user_id as post_user_id,
              u.username AS user_name,
              ROUND(AVG(c.rating), 1) AS average_rating
       FROM favorites f
       JOIN posts p ON p.id = f.post_id
       JOIN users u ON u.id = p.user_id
       LEFT JOIN comments c ON c.post_id = p.id
       WHERE f.user_id = ?
       GROUP BY p.id, p.title, p.description, p.image_url, p.created_at, p.user_id, u.username
       ORDER BY p.created_at DESC`,
      [req.user.id]
    )
    
    // Mapear resultados
    const posts = result.rows.map(row => ({
      id: row.post_id,
      title: row.title,
      description: row.description,
      image_url: row.image_url,
      created_at: row.created_at,
      user_id: row.post_user_id,
      user_name: row.user_name,
      is_favorite: true,
      average_rating: row.average_rating || null
    }))
    
    res.json(posts)
  } catch (err) {
    console.error('Error al obtener favoritos:', err);
    res.status(500).json({ error: 'Error al obtener favoritos', details: err.message })
  }
})

// Añadir favorito
router.post('/', verifyToken, async (req, res) => {
  const { postId } = req.body
  try {
    const existing = await db.query(
      `SELECT * FROM favorites WHERE user_id=? AND post_id=?`,
      [req.user.id, postId]
    )
    if (existing.rows.length) {
      return res.status(400).json({ error: 'Ya está en favoritos' })
    }
    const result = await db.query(
      `INSERT INTO favorites (user_id, post_id) VALUES (?, ?)`,
      [req.user.id, postId]
    )
    
    // Obtener el favorito recién creado
    const newFavorite = await db.query(
      `SELECT f.*, p.title, p.description, p.image_url
       FROM favorites f
       JOIN posts p ON f.post_id = p.id
       WHERE f.id = ?`,
      [result.insertId]
    )
    
    res.status(201).json(newFavorite.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo añadir favorito' })
  }
})

// Quitar favorito
router.delete('/', verifyToken, async (req, res) => {
  const { postId } = req.body
  try {
    await db.query(`DELETE FROM favorites WHERE user_id=? AND post_id=?`, [req.user.id, postId])
    res.json({ removed: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo quitar favorito' })
  }
})

export default router