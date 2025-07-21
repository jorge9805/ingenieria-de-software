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

// Crear app de prueba para comentarios
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  const router = express.Router();

  // Crear comentario
  router.post('/', mockAuth, async (req, res) => {
    const { postId, content, rating } = req.body;
    try {
      const result = await testDb.query(
        `INSERT INTO comments (user_id, post_id, content, rating)
         VALUES (?, ?, ?, ?)`,
        [req.user.id, postId, content, rating]
      );

      const newCommentResult = await testDb.query(
        `SELECT c.*, u.username AS user_name
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [result.insertId]
      );

      const newComment = newCommentResult.rows[0];
      res.status(201).json(newComment);
    } catch (err) {
      console.error('Error creando comentario:', err);
      res.status(500).json({ error: 'No se pudo crear el comentario' });
    }
  });

  // Editar comentario
  router.put('/:id', mockAuth, async (req, res) => {
    const { id } = req.params;
    const { content, rating } = req.body;

    try {
      const commentResult = await testDb.query(
        'SELECT * FROM comments WHERE id = ? AND user_id = ?',
        [id, req.user.id]
      );

      if (commentResult.rows.length === 0) {
        return res.status(404).json({ error: 'Comentario no encontrado o no tienes permisos para editarlo' });
      }

      await testDb.query(
        'UPDATE comments SET content = ?, rating = ? WHERE id = ?',
        [content, rating, id]
      );

      const updatedCommentResult = await testDb.query(
        `SELECT c.*, u.username AS user_name
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [id]
      );

      const updatedComment = updatedCommentResult.rows[0];
      res.json(updatedComment);
    } catch (err) {
      console.error('Error editando comentario:', err);
      res.status(500).json({ error: 'No se pudo editar el comentario' });
    }
  });

  // Eliminar comentario
  router.delete('/:id', mockAuth, async (req, res) => {
    const { id } = req.params;

    try {
      const commentResult = await testDb.query(
        'SELECT * FROM comments WHERE id = ? AND user_id = ?',
        [id, req.user.id]
      );

      if (commentResult.rows.length === 0) {
        return res.status(404).json({ error: 'Comentario no encontrado o no tienes permisos para eliminarlo' });
      }

      await testDb.query('DELETE FROM comments WHERE id = ?', [id]);

      res.json({ success: true, message: 'Comentario eliminado correctamente' });
    } catch (err) {
      console.error('Error eliminando comentario:', err);
      res.status(500).json({ error: 'No se pudo eliminar el comentario' });
    }
  });

  // Obtener mis comentarios
  router.get('/my', mockAuth, async (req, res) => {
    try {
      const result = await testDb.query(
        `SELECT c.*, u.username AS user_name, p.title AS post_title, p.id AS post_id
         FROM comments c
         JOIN users u ON c.user_id = u.id
         JOIN posts p ON c.post_id = p.id
         WHERE c.user_id = ?
         ORDER BY c.created_at DESC`,
        [req.user.id]
      );

      res.json(result.rows);
    } catch (err) {
      console.error('Error obteniendo mis comentarios:', err);
      res.status(500).json({ error: 'Error al obtener mis comentarios' });
    }
  });

  app.use('/api/comments', router);
  return app;
};

describe('Comments API Tests', () => {
  let app;
  let testUser;
  let testPost;
  let otherUser;

  beforeAll(async () => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await testUtils.cleanDatabase();

    testUser = await testUtils.createTestUser({
      username: 'commentuser',
      email: 'commentuser@example.com'
    });

    otherUser = await testUtils.createTestUser({
      username: 'otheruser',
      email: 'other@example.com'
    });

    testPost = await testUtils.createTestPost(testUser.id, {
      title: 'Post para comentarios'
    });
  });

  afterAll(async () => {
    await testUtils.closeDatabase();
  });

  describe('POST /api/comments - Creación de comentario', () => {
    test('Debe crear un comentario correctamente', async () => {
      const newComment = {
        postId: testPost.id,
        content: 'Excelente destino, lo recomiendo mucho',
        rating: 5
      };

      const response = await request(app)
        .post('/api/comments')
        .set('x-test-user-id', testUser.id)
        .send(newComment);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        content: newComment.content,
        rating: newComment.rating,
        post_id: testPost.id,
        user_id: testUser.id,
        user_name: testUser.username
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.created_at).toBeDefined();
    });

    test('Debe fallar al crear comentario sin autenticación', async () => {
      const newComment = {
        postId: testPost.id,
        content: 'Comentario sin auth',
        rating: 4
      };

      const response = await request(app)
        .post('/api/comments')
        .send(newComment);

      expect(response.status).toBe(500);
    });

    test('Debe validar datos requeridos', async () => {
      const incompleteComment = {
        postId: testPost.id
        // Faltan content y rating
      };

      const response = await request(app)
        .post('/api/comments')
        .set('x-test-user-id', testUser.id)
        .send(incompleteComment);

      expect(response.status).toBe(500);
    });

    test('Debe crear comentario con rating válido', async () => {
      const validRatings = [1, 2, 3, 4, 5];

      for (const rating of validRatings) {
        const comment = {
          postId: testPost.id,
          content: `Comentario con rating ${rating}`,
          rating
        };

        const response = await request(app)
          .post('/api/comments')
          .set('x-test-user-id', testUser.id)
          .send(comment);

        expect(response.status).toBe(201);
        expect(response.body.rating).toBe(rating);
      }
    });
  });

  describe('PUT /api/comments/:id - Editar comentario', () => {
    test('Debe editar un comentario del usuario autenticado', async () => {
      // Crear comentario de prueba
      const testComment = await testUtils.createTestComment(testUser.id, testPost.id, {
        content: 'Comentario original',
        rating: 3
      });

      const updatedData = {
        content: 'Comentario editado',
        rating: 5
      };

      const response = await request(app)
        .put(`/api/comments/${testComment.id}`)
        .set('x-test-user-id', testUser.id)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: testComment.id,
        content: updatedData.content,
        rating: updatedData.rating,
        user_name: testUser.username
      });
    });

    test('No debe editar comentario de otro usuario', async () => {
      // Crear comentario del otro usuario
      const testComment = await testUtils.createTestComment(otherUser.id, testPost.id, {
        content: 'Comentario de otro usuario',
        rating: 4
      });

      const updatedData = {
        content: 'Intento de edición',
        rating: 1
      };

      const response = await request(app)
        .put(`/api/comments/${testComment.id}`)
        .set('x-test-user-id', testUser.id)
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('no encontrado o no tienes permisos');
    });

    test('Debe devolver error al editar comentario inexistente', async () => {
      const updatedData = {
        content: 'Comentario inexistente',
        rating: 5
      };

      const response = await request(app)
        .put('/api/comments/999999')
        .set('x-test-user-id', testUser.id)
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('no encontrado');
    });
  });

  describe('DELETE /api/comments/:id - Eliminación de comentario', () => {
    test('Debe eliminar un comentario del usuario autenticado', async () => {
      // Crear comentario de prueba
      const testComment = await testUtils.createTestComment(testUser.id, testPost.id, {
        content: 'Comentario a eliminar',
        rating: 4
      });

      const response = await request(app)
        .delete(`/api/comments/${testComment.id}`)
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('eliminado correctamente');

      // Verificar que el comentario fue eliminado
      const checkResult = await testDb.query(
        'SELECT * FROM comments WHERE id = ?',
        [testComment.id]
      );
      expect(checkResult.rows.length).toBe(0);
    });

    test('No debe eliminar comentario de otro usuario', async () => {
      // Crear comentario del otro usuario
      const testComment = await testUtils.createTestComment(otherUser.id, testPost.id, {
        content: 'Comentario de otro usuario',
        rating: 3
      });

      const response = await request(app)
        .delete(`/api/comments/${testComment.id}`)
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('no encontrado o no tienes permisos');

      // Verificar que el comentario NO fue eliminado
      const checkResult = await testDb.query(
        'SELECT * FROM comments WHERE id = ?',
        [testComment.id]
      );
      expect(checkResult.rows.length).toBe(1);
    });

    test('Debe devolver error al eliminar comentario inexistente', async () => {
      const response = await request(app)
        .delete('/api/comments/999999')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('no encontrado');
    });
  });

  describe('GET /api/comments/my - Obtener mis comentarios', () => {
    test('Debe obtener comentarios del usuario autenticado', async () => {
      // Crear varios comentarios del usuario
      await testUtils.createTestComment(testUser.id, testPost.id, {
        content: 'Primer comentario',
        rating: 5
      });

      await testUtils.createTestComment(testUser.id, testPost.id, {
        content: 'Segundo comentario',
        rating: 4
      });

      // Crear comentario de otro usuario (no debe aparecer)
      await testUtils.createTestComment(otherUser.id, testPost.id, {
        content: 'Comentario de otro',
        rating: 3
      });

      const response = await request(app)
        .get('/api/comments/my')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);

      // Verificar que todos los comentarios pertenecen al usuario
      response.body.forEach(comment => {
        expect(comment.user_id).toBe(testUser.id);
        expect(comment.user_name).toBe(testUser.username);
        expect(comment.post_title).toBe(testPost.title);
      });
    });

    test('Debe devolver array vacío si el usuario no tiene comentarios', async () => {
      const response = await request(app)
        .get('/api/comments/my')
        .set('x-test-user-id', testUser.id);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });
});
