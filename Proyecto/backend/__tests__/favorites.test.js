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

jest.mock('../middleware/auth.js', () => mockAuth);

// Crear app de prueba para favoritos
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  const router = express.Router();

  // Listar favoritos
  router.get('/', mockAuth, async (req, res) => {
    try {
      const result = await testDb.query(
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
      );

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
      }));

      res.json(posts);
    } catch (err) {
      console.error('Error al obtener favoritos:', err);
      res.status(500).json({ error: 'Error al obtener favoritos', details: err.message });
    }
  });

  // Añadir favorito
  router.post('/', mockAuth, async (req, res) => {
    const { postId } = req.body;
    try {
      const existing = await testDb.query(
        'SELECT * FROM favorites WHERE user_id=? AND post_id=?',
        [req.user.id, postId]
      );

      if (existing.rows.length) {
        return res.status(400).json({ error: 'Ya está en favoritos' });
      }

      const result = await testDb.query(
        'INSERT INTO favorites (user_id, post_id) VALUES (?, ?)',
        [req.user.id, postId]
      );

      const newFavorite = await testDb.query(
        `SELECT f.*, p.title, p.description, p.image_url
         FROM favorites f
         JOIN posts p ON f.post_id = p.id
         WHERE f.id = ?`,
        [result.insertId]
      );

      res.status(201).json(newFavorite.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo añadir favorito' });
    }
  });

  // Quitar favorito
  router.delete('/', mockAuth, async (req, res) => {
    const { postId } = req.body;
    try {
      const result = await testDb.query(
        'DELETE FROM favorites WHERE user_id=? AND post_id=?',
        [req.user.id, postId]
      );

      res.json({ removed: true, rowsAffected: result.rowCount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo quitar favorito' });
    }
  });

  app.use('/api/favorites', router);
  return app;
};

describe('Favorites API Tests', () => {
  let app;
  let testUser;
  let otherUser;
  let testPost1;
  let testPost2;

  beforeAll(async () => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await testUtils.cleanDatabase();

    testUser = await testUtils.createTestUser({
      username: 'favoriteuser',
      email: 'favorite@example.com'
    });

    otherUser = await testUtils.createTestUser({
      username: 'otheruser',
      email: 'other@example.com'
    });

    testPost1 = await testUtils.createTestPost(testUser.id, {
      title: 'Post 1 para favoritos'
    });

    testPost2 = await testUtils.createTestPost(otherUser.id, {
      title: 'Post 2 para favoritos'
    });
  });

  afterAll(async () => {
    await testUtils.closeDatabase();
  });

  describe('POST /api/favorites - Agregar a favoritos', () => {
    test('Debe agregar un post a favoritos correctamente', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .set('x-test-user-id', testUser.id)
        .send({ postId: testPost1.id });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        user_id: testUser.id,
        post_id: testPost1.id,
        title: testPost1.title,
        description: testPost1.description
      });
      expect(response.body.id).toBeDefined();
    });

    test('Debe agregar post de otro usuario a favoritos', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .set('x-test-user-id', testUser.id)
        .send({ postId: testPost2.id });

      expect(response.status).toBe(201);
      expect(response.body.post_id).toBe(testPost2.id);
      expect(response.body.user_id).toBe(testUser.id);
    });

    test('No debe permitir agregar el mismo post dos veces', async () => {
      // Agregar primera vez
      await request(app)
        .post('/api/favorites')
        .set('x-test-user-id', testUser.id)
        .send({ postId: testPost1.id });

      // Intentar agregar segunda vez
      const response = await request(app)
        .post('/api/favorites')
        .set('x-test-user-id', testUser.id)
        .send({ postId: testPost1.id });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Ya está en favoritos');
    });

    test('Debe fallar al agregar favorito sin autenticación', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .send({ postId: testPost1.id });

      expect(response.status).toBe(500);
    });

    test('Debe fallar al agregar favorito sin postId', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .set('x-test-user-id', testUser.id)
        .send({});

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /api/favorites - Eliminar de favoritos', () => {
    beforeEach(async () => {
      // Agregar favoritos de prueba
      await testUtils.createTestFavorite(testUser.id, testPost1.id);
      await testUtils.createTestFavorite(testUser.id, testPost2.id);
    });

    test('Debe eliminar un post de favoritos correctamente', async () => {
      const response = await request(app)
        .delete('/api/favorites')
        .set('x-test-user-id', testUser.id)
        .send({ postId: testPost1.id });

      expect(response.status).toBe(200);
      expect(response.body.removed).toBe(true);
      expect(response.body.rowsAffected).toBe(1);

      // Verificar que el favorito fue eliminado
      const checkResult = await testDb.query(
        'SELECT * FROM favorites WHERE user_id = ? AND post_id = ?',
        [testUser.id, testPost1.id]
      );
      expect(checkResult.rows.length).toBe(0);
    });

    test('Debe devolver éxito aunque el post no esté en favoritos', async () => {
      // Crear un post que no está en favoritos
      const nonFavoritePost = await testUtils.createTestPost(testUser.id, {
        title: 'Post no favorito'
      });

      const response = await request(app)
        .delete('/api/favorites')
        .set('x-test-user-id', testUser.id)
        .send({ postId: nonFavoritePost.id });

      expect(response.status).toBe(200);
      expect(response.body.removed).toBe(true);
      expect(response.body.rowsAffected).toBe(0);
    });

    test('No debe eliminar favoritos de otro usuario', async () => {
      // Crear favorito de otro usuario
      await testUtils.createTestFavorite(otherUser.id, testPost1.id);

      const response = await request(app)
        .delete('/api/favorites')
        .set('x-test-user-id', testUser.id)
        .send({ postId: testPost1.id });

      expect(response.status).toBe(200);

      // Verificar que el favorito del otro usuario sigue existiendo
      const checkResult = await testDb.query(
        'SELECT * FROM favorites WHERE user_id = ? AND post_id = ?',
        [otherUser.id, testPost1.id]
      );
      expect(checkResult.rows.length).toBe(1);
    });
  });

  describe('GET /api/favorites - Listar favoritos', () => {
    beforeEach(async () => {
      // Agregar favoritos de prueba
      await testUtils.createTestFavorite(testUser.id, testPost1.id);
      await testUtils.createTestFavorite(testUser.id, testPost2.id);

      // Agregar comentarios para probar el cálculo de rating promedio
      await testUtils.createTestComment(testUser.id, testPost1.id, { rating: 5 });
      await testUtils.createTestComment(otherUser.id, testPost1.id, { rating: 4 });
    });

    test('Debe listar todos los favoritos del usuario', async () => {
      const response = await request(app)
        .get('/api/favorites')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);

      // Verificar estructura de datos
      response.body.forEach(favorite => {
        expect(favorite).toHaveProperty('id');
        expect(favorite).toHaveProperty('title');
        expect(favorite).toHaveProperty('description');
        expect(favorite).toHaveProperty('is_favorite', true);
        expect(favorite).toHaveProperty('user_name');
      });
    });

    test('Debe calcular el rating promedio correctamente', async () => {
      const response = await request(app)
        .get('/api/favorites')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);

      const postWithRating = response.body.find(p => p.id === testPost1.id);
      expect(postWithRating.average_rating).toBe(4.5); // Promedio de 5 y 4
    });

    test('Debe devolver array vacío si no hay favoritos', async () => {
      // Limpiar favoritos del usuario
      await testDb.query('DELETE FROM favorites WHERE user_id = ?', [testUser.id]);

      const response = await request(app)
        .get('/api/favorites')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    test('Solo debe mostrar favoritos del usuario autenticado', async () => {
      // Crear favorito de otro usuario
      const otherPost = await testUtils.createTestPost(otherUser.id, {
        title: 'Post de otro usuario'
      });
      await testUtils.createTestFavorite(otherUser.id, otherPost.id);

      const response = await request(app)
        .get('/api/favorites')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2); // Solo los 2 favoritos del testUser

      // Verificar que todos pertenecen al usuario correcto
      response.body.forEach(favorite => {
        // Verificar que el post fue guardado como favorito por testUser
        expect([testPost1.id, testPost2.id]).toContain(favorite.id);
      });
    });
  });
});
