import express from 'express';
import db from '../db.js';
import verifyToken, { optionalAuth } from '../middleware/auth.js';
const router = express.Router();

// Ruta específica para búsqueda
router.get('/search', optionalAuth, async (req, res) => {
  console.log('🔍 RUTA DE BÚSQUEDA EJECUTADA'); // Debug crítico

  try {
    const userId = req.user ? req.user.id : null;
    const { q } = req.query; // Usar 'q' en lugar de 'search'

    console.log('Término de búsqueda:', q); // Debug

    if (!q || !q.trim()) {
      return res.json([]);
    }

    const searchPattern = `%${q.trim().toLowerCase()}%`;
    console.log('Patrón de búsqueda:', searchPattern); // Debug

    const result = await db.query(`
      SELECT p.*, u.username AS user_name,
             ROUND(AVG(c.rating),1) AS average_rating,
             CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN comments c ON c.post_id = p.id
      LEFT JOIN favorites f ON f.post_id = p.id AND f.user_id = ?
      WHERE LOWER(p.title) LIKE ? 
         OR LOWER(p.description) LIKE ? 
         OR LOWER(COALESCE(p.keywords, '')) LIKE ?
      GROUP BY p.id, p.title, p.description, p.image_url, p.keywords, p.user_id, p.created_at, u.username, f.id
      ORDER BY p.created_at DESC
    `, [userId, searchPattern, searchPattern, searchPattern]);

    console.log('Resultados de búsqueda:', result.rows.length); // Debug

    const posts = result.rows.map(row => ({
      ...row,
      is_favorite: Boolean(row.is_favorite)
    }));

    res.json(posts);
  } catch (err) {
    console.error('Error en búsqueda:', err);
    res.status(500).json({ error: 'Error al buscar posts' });
  }
});

// Ruta de prueba simple
router.get('/test', (req, res) => {
  console.log('🧪 RUTA DE PRUEBA EJECUTADA');
  console.log('Query params:', req.query);
  res.json({ message: 'Ruta de prueba funcionando', params: req.query });
});

// Obtener todos los posts con rating y favorite flag (con búsqueda opcional)
router.get('/', optionalAuth, async (req, res) => {
  console.log('🔍 RUTA GET / EJECUTADA'); // Debug crítico
  console.log('=== INICIO DE BÚSQUEDA ==='); // Debug
  console.log('Query params:', req.query); // Debug

  try {
    const userId = req.user ? req.user.id : null;
    const { search } = req.query; // Parámetro de búsqueda opcional

    console.log('UserId:', userId); // Debug
    console.log('Parámetro de búsqueda recibido:', search); // Debug

    // Búsqueda simplificada para debug
    if (search && search.trim()) {
      console.log('MODO BÚSQUEDA ACTIVADO'); // Debug
      const searchPattern = `%${search.trim().toLowerCase()}%`;

      const result = await db.query(`
        SELECT p.*, u.username AS user_name,
               ROUND(AVG(c.rating),1) AS average_rating,
               0 as is_favorite
        FROM posts p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN comments c ON c.post_id = p.id
        WHERE LOWER(p.title) LIKE ? 
           OR LOWER(p.description) LIKE ? 
           OR LOWER(COALESCE(p.keywords, '')) LIKE ?
        GROUP BY p.id, p.title, p.description, p.image_url, p.keywords, p.user_id, p.created_at, u.username
        ORDER BY p.created_at DESC
      `, [searchPattern, searchPattern, searchPattern]);

      console.log('Resultados de búsqueda:', result.rows.length); // Debug

      const posts = result.rows.map(row => ({
        ...row,
        is_favorite: false
      }));

      res.json(posts);
      return;
    }

    // Consulta normal sin búsqueda
    console.log('MODO NORMAL (SIN BÚSQUEDA)'); // Debug
    const result = await db.query(`
      SELECT p.*, u.username AS user_name,
             ROUND(AVG(c.rating),1) AS average_rating,
             CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN comments c ON c.post_id = p.id
      LEFT JOIN favorites f ON f.post_id = p.id AND f.user_id = ?
      GROUP BY p.id, p.title, p.description, p.image_url, p.keywords, p.user_id, p.created_at, u.username, f.id
      ORDER BY p.created_at DESC
    `, [userId]);

    console.log('Resultados normales:', result.rows.length); // Debug

    // Convertir is_favorite de número a boolean
    const posts = result.rows.map(row => ({
      ...row,
      is_favorite: Boolean(row.is_favorite)
    }));

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

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
    );

    // Convertir is_favorite de número a boolean
    const posts = result.rows.map(row => ({
      ...row,
      is_favorite: Boolean(row.is_favorite)
    }));

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener mis posts' });
  }
});

// Crear post
router.post('/', verifyToken, async (req, res) => {
  const { title, description, image_url, keywords } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO posts (user_id, title, description, image_url, keywords)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, title, description, image_url, keywords || '']
    );

    // Obtener el post recién creado
    const newPost = (await db.query(
      `SELECT p.*, u.username AS user_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [result.insertId]
    )).rows[0];

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo crear el post' });
  }
});

// Eliminar post
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo eliminar el post' });
  }
});

// Obtener post por id con comentarios (AL FINAL para no interceptar otras rutas)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
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
    )).rows[0];

    const comments = (await db.query(
      `SELECT c.*, u.username AS user_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE post_id = ?
       ORDER BY c.created_at`,
      [id]
    )).rows;

    post.comments = comments;
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el post' });
  }
});

export default router;

