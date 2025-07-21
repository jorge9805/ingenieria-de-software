import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import testDb from './testDb.js';

const SECRET = 'test-secret';

// Utilitarios para pruebas
export const testUtils = {
  // Crear usuario de prueba
  async createTestUser(userData = {}) {
    const defaultUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = { ...defaultUser, ...userData };
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const result = await testDb.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [user.username, user.email, hashedPassword]
    );

    return {
      id: result.insertId,
      username: user.username,
      email: user.email,
      password: user.password // Mantener la contraseña original para tests
    };
  },

  // Crear post de prueba
  async createTestPost(userId, postData = {}) {
    const defaultPost = {
      title: 'Test Post',
      description: 'Test description',
      image_url: 'http://example.com/image.jpg',
      keywords: 'test, keywords'
    };

    const post = { ...defaultPost, ...postData };

    const result = await testDb.query(
      'INSERT INTO posts (user_id, title, description, image_url, keywords) VALUES (?, ?, ?, ?, ?)',
      [userId, post.title, post.description, post.image_url, post.keywords]
    );

    return {
      id: result.insertId,
      user_id: userId,
      ...post
    };
  },

  // Crear comentario de prueba
  async createTestComment(userId, postId, commentData = {}) {
    const defaultComment = {
      content: 'Test comment',
      rating: 5
    };

    const comment = { ...defaultComment, ...commentData };

    const result = await testDb.query(
      'INSERT INTO comments (user_id, post_id, content, rating) VALUES (?, ?, ?, ?)',
      [userId, postId, comment.content, comment.rating]
    );

    return {
      id: result.insertId,
      user_id: userId,
      post_id: postId,
      ...comment
    };
  },

  // Crear favorito de prueba
  async createTestFavorite(userId, postId) {
    const result = await testDb.query(
      'INSERT INTO favorites (user_id, post_id) VALUES (?, ?)',
      [userId, postId]
    );

    return {
      id: result.insertId,
      user_id: userId,
      post_id: postId
    };
  },

  // Generar token JWT
  generateTestToken(userId, username) {
    return jwt.sign({ id: userId, username }, SECRET, { expiresIn: '1h' });
  },

  // Limpiar base de datos
  async cleanDatabase() {
    await testDb.reset();
  },

  // Cerrar conexión de base de datos
  async closeDatabase() {
    await testDb.close();
  }
};
