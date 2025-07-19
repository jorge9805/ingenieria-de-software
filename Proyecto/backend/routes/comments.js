import express from 'express'
import db from '../db.js'
import verifyToken from '../middleware/auth.js'
const router = express.Router()

// Obtener mis comentarios
router.get('/my', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, u.username AS user_name, p.title AS post_title, p.id AS post_id
       FROM comments c
       JOIN users u ON c.user_id = u.id
       JOIN posts p ON c.post_id = p.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [req.user.id]
    )
    
    res.json(result.rows)
  } catch (err) {
    console.error('Error obteniendo mis comentarios:', err)
    res.status(500).json({ error: 'Error al obtener mis comentarios' })
  }
})

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

// Editar comentario
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  const { content, rating } = req.body
  
  try {
    // Verificar que el comentario existe y pertenece al usuario
    const commentResult = await db.query(
      `SELECT * FROM comments WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    )
    
    if (commentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado o no tienes permisos para editarlo' })
    }
    
    // Actualizar el comentario
    await db.query(
      `UPDATE comments SET content = ?, rating = ? WHERE id = ?`,
      [content, rating, id]
    )
    
    // Obtener el comentario actualizado con información del usuario
    const updatedCommentResult = await db.query(
      `SELECT c.*, u.username AS user_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    )
    
    const updatedComment = updatedCommentResult.rows[0]
    res.json(updatedComment)
  } catch (err) {
    console.error('Error editando comentario:', err)
    res.status(500).json({ error: 'No se pudo editar el comentario' })
  }
})

// Eliminar comentario
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  
  try {
    // Verificar que el comentario existe y pertenece al usuario
    const commentResult = await db.query(
      `SELECT * FROM comments WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    )
    
    if (commentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado o no tienes permisos para eliminarlo' })
    }
    
    // Eliminar el comentario
    await db.query(`DELETE FROM comments WHERE id = ?`, [id])
    
    res.json({ success: true, message: 'Comentario eliminado correctamente' })
  } catch (err) {
    console.error('Error eliminando comentario:', err)
    res.status(500).json({ error: 'No se pudo eliminar el comentario' })
  }
})

export default router
