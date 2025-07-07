import express from 'express'
import pool from '../db.js'
import verifyToken from '../middleware/auth.js'
const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  const { postId, comment_text, rating } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO comments (user_id, post_id, comment_text, rating)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.user.id, postId, comment_text, rating]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo crear el comentario' })
  }
})

export default router
