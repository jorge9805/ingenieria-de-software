import express from 'express'
import pool from '../db.js'
import verifyToken from '../middleware/auth.js'
const router = express.Router()

// Endpoint de prueba para verificar conectividad
router.get('/test', verifyToken, async (req, res) => {
  try {
    console.log('Test endpoint - usuario:', req.user.id);
    const testResult = await pool.query('SELECT 1 as test');
    console.log('Database connection OK');
    res.json({ message: 'OK', user: req.user.id, dbTest: testResult.rows[0] });
  } catch (err) {
    console.error('Test endpoint error:', err);
    res.status(500).json({ error: 'Test failed', details: err.message });
  }
})

// Listar favoritos del usuario
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('=== INICIO FAVORITOS ===');
    console.log('Obteniendo favoritos para usuario:', req.user.id);
    
    // Consulta más simple para debug
    const result = await pool.query(
      `SELECT p.id as post_id, p.title, p.description, p.image_url, p.created_at, p.user_id as post_user_id,
              u.name AS user_name
       FROM favorites f
       JOIN posts p ON p.id = f.post_id
       JOIN users u ON u.id = p.user_id
       WHERE f.user_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    )
    
    console.log('Consulta ejecutada exitosamente');
    console.log('Favoritos encontrados:', result.rows.length);
    
    if (result.rows.length > 0) {
      console.log('Primer resultado:', result.rows[0]);
    }
    
    // Mapear resultados de forma simple
    const posts = result.rows.map(row => ({
      id: row.post_id,
      title: row.title,
      description: row.description,
      image_url: row.image_url,
      created_at: row.created_at,
      user_id: row.post_user_id,
      user_name: row.user_name,
      is_favorite: true,
      average_rating: "0"
    }))
    
    console.log('Posts mapeados:', posts.length);
    if (posts.length > 0) {
      console.log('Primer post mapeado:', posts[0]);
      console.log('is_favorite del primer post:', posts[0].is_favorite);
    }
    console.log('=== FIN FAVORITOS ===');
    
    res.json(posts)
  } catch (err) {
    console.error('=== ERROR EN FAVORITOS ===');
    console.error('Error completo:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ error: 'Error al obtener favoritos', details: err.message })
  }
})

// Añadir favorito
router.post('/', verifyToken, async (req, res) => {
  const { postId } = req.body
  try {
    const existing = await pool.query(
      `SELECT * FROM favorites WHERE user_id=$1 AND post_id=$2`,
      [req.user.id, postId]
    )
    if (existing.rows.length) {
      return res.status(400).json({ error: 'Ya está en favoritos' })
    }
    const result = await pool.query(
      `INSERT INTO favorites (user_id, post_id) VALUES ($1,$2) RETURNING *`,
      [req.user.id, postId]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo añadir favorito' })
  }
})

// Quitar favorito
router.delete('/', verifyToken, async (req, res) => {
  const { postId } = req.body
  try {
    await pool.query(`DELETE FROM favorites WHERE user_id=$1 AND post_id=$2`, [req.user.id, postId])
    res.json({ removed: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo quitar favorito' })
  }
})

export default router