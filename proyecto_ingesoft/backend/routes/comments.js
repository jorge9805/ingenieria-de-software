import express from 'express'
import db from '../db.js'
import verifyToken from '../middleware/auth.js'
const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  const { postId, content, rating } = req.body
  try {
    const result = await db.query(
      `INSERT INTO comments (user_id, post_id, content, rating)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, postId, content, rating]
    )
    
    // Obtener el comentario recién creado con información del usuario
    const newCommentResult = await db.query(
      `SELECT c.*, u.username AS user_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );
    
    const newComment = newCommentResult.rows[0];
    res.status(201).json(newComment)
  } catch (err) {
    console.error('Error creando comentario:', err)
    res.status(500).json({ error: 'No se pudo crear el comentario' })
  }
})

export default router
