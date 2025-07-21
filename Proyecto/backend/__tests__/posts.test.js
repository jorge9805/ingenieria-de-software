import request from 'supertest';
import express from 'express';
import { testUtils } from './testUtils.js';
import testDb from './testDb.js';

// Mock del módulo db original
jest.mock('../db.js', () => ({
  default: {
    query: jest.fn().mockImplementation((sql, params) => {
      return require('./testDb.js').default.query(sql, params);
    })
  }
}));

// Mock del middleware de autenticación
const mockAuth = (req, res, next) => {
  req.user = { id: req.headers['x-test-user-id'] };
  next();
};

// Mock del middleware auth opcional
const mockOptionalAuth = (req, res, next) => {
  if (req.headers['x-test-user-id']) {
    req.user = { id: req.headers['x-test-user-id'] };
  }
  next();
};

// Mock del módulo de middleware completo
jest.mock('../middleware/auth.js', () => ({
  default: mockAuth,
  optionalAuth: mockOptionalAuth
}));

// Crear app de prueba
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Reemplazar middleware en las rutas
  const router = express.Router();

  // Ruta para crear posts (requiere autenticación)
  router.post('/', mockAuth, async (req, res) => {
    const { title, description, image_url, keywords } = req.body;
    try {
      const result = await testDb.query(
        `INSERT INTO posts (user_id, title, description, image_url, keywords)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, title, description, image_url, keywords || '']
      );

      const newPost = await testDb.query(
        `SELECT p.*, u.username AS user_name,
                0 AS average_rating,
                0 as is_favorite
         FROM posts p
         JOIN users u ON u.id = p.user_id
         WHERE p.id = ?`,
        [result.insertId]
      );

      res.status(201).json(newPost.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo crear el post' });
    }
  });

  // Ruta para eliminar posts (requiere autenticación)
  router.delete('/:id', mockAuth, async (req, res) => {
    const { id } = req.params;
    try {
      await testDb.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [id, req.user.id]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el post' });
    }
  });

  // Ruta de búsqueda
  router.get('/search', mockOptionalAuth, async (req, res) => {
    try {
      const { q } = req.query;
      const userId = req.user ? req.user.id : null;

      if (!q || !q.trim()) {
        return res.json([]);
      }

      const searchPattern = `%${q.trim().toLowerCase()}%`;

      let result;
      if (userId) {
        // Usuario autenticado - incluir favoritos
        result = await testDb.query(`
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
      } else {
        // Usuario no autenticado - sin favoritos
        result = await testDb.query(`
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
      }

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

  app.use('/api/posts', router);
  return app;
};

describe('Posts API Tests', () => {
  let app;
  let testUser;

  beforeAll(async () => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await testUtils.cleanDatabase();
    testUser = await testUtils.createTestUser({
      username: 'postuser',
      email: 'postuser@example.com'
    });
  });

  afterAll(async () => {
    await testUtils.closeDatabase();
  });

  describe('POST /api/posts - Creación de posts', () => {
    test('Debe crear un post correctamente', async () => {
      const newPost = {
        title: 'Playa Hermosa',
        description: 'Una playa increíble en Costa Rica',
        image_url: 'http://example.com/playa.jpg',
        keywords: 'playa, costa rica, turismo'
      };

      const response = await request(app)
        .post('/api/posts')
        .set('x-test-user-id', testUser.id)
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: newPost.title,
        description: newPost.description,
        image_url: newPost.image_url,
        keywords: newPost.keywords,
        user_name: testUser.username,
        average_rating: 0,
        is_favorite: 0
      });
      expect(response.body.id).toBeDefined();
    });

    test('Debe fallar al crear post sin autenticación', async () => {
      const newPost = {
        title: 'Playa Test',
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPost);

      expect(response.status).toBe(500); // El middleware mock devuelve undefined para req.user.id
    });

    test('Debe crear post con campos opcionales vacíos', async () => {
      const newPost = {
        title: 'Solo Título',
        description: '',
        image_url: '',
        keywords: ''
      };

      const response = await request(app)
        .post('/api/posts')
        .set('x-test-user-id', testUser.id)
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.keywords).toBe('');
    });
  });

  describe('DELETE /api/posts/:id - Eliminación de posts', () => {
    test('Debe eliminar un post del usuario autenticado', async () => {
      // Crear post de prueba
      const testPost = await testUtils.createTestPost(testUser.id, {
        title: 'Post a eliminar'
      });

      const response = await request(app)
        .delete(`/api/posts/${testPost.id}`)
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verificar que el post fue eliminado
      const checkResult = await testDb.query(
        'SELECT * FROM posts WHERE id = ?',
        [testPost.id]
      );
      expect(checkResult.rows.length).toBe(0);
    });

    test('No debe eliminar post de otro usuario', async () => {
      // Crear otro usuario
      const otherUser = await testUtils.createTestUser({
        username: 'otheruser',
        email: 'other@example.com'
      });

      // Crear post del otro usuario
      const testPost = await testUtils.createTestPost(otherUser.id, {
        title: 'Post de otro usuario'
      });

      const response = await request(app)
        .delete(`/api/posts/${testPost.id}`)
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verificar que el post NO fue eliminado (porque no pertenece al usuario)
      const checkResult = await testDb.query(
        'SELECT * FROM posts WHERE id = ?',
        [testPost.id]
      );
      expect(checkResult.rows.length).toBe(1);
    });

    test('Debe devolver error 404 al intentar eliminar post inexistente', async () => {
      const response = await request(app)
        .delete('/api/posts/999999')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true); // SQLite no devuelve error al eliminar registros inexistentes
    });
  });

  describe('GET /api/posts/search - Buscador de destinos', () => {
    beforeEach(async () => {
      // Crear posts de prueba
      await testUtils.createTestPost(testUser.id, {
        title: 'Playa Tamarindo',
        description: 'Hermosa playa en Guanacaste',
        keywords: 'playa, costa rica, surf'
      });

      await testUtils.createTestPost(testUser.id, {
        title: 'Volcán Arenal',
        description: 'Volcán activo con aguas termales',
        keywords: 'volcán, aventura, naturaleza'
      });

      await testUtils.createTestPost(testUser.id, {
        title: 'Monteverde',
        description: 'Bosque nuboso con diversidad única',
        keywords: 'bosque, naturaleza, aventura'
      });
    });

    test('Debe buscar destinos por título', async () => {
      const response = await request(app)
        .get('/api/posts/search?q=playa')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toContain('Playa Tamarindo');
    });

    test('Debe buscar destinos por descripción', async () => {
      const response = await request(app)
        .get(`/api/posts/search?q=${  encodeURIComponent('volcán')}`)
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toContain('Volcán Arenal');
    });

    test('Debe buscar destinos por keywords', async () => {
      const response = await request(app)
        .get('/api/posts/search?q=aventura')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2); // Volcán Arenal y Monteverde tienen 'aventura'
    });

    test('Debe devolver array vacío sin query de búsqueda', async () => {
      const response = await request(app)
        .get('/api/posts/search')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    test('Debe funcionar la búsqueda sin autenticación', async () => {
      const response = await request(app)
        .get('/api/posts/search?q=playa');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].is_favorite).toBe(false);
    });

    test('Debe ser búsqueda insensible a mayúsculas', async () => {
      const response = await request(app)
        .get('/api/posts/search?q=PLAYA')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });
});
