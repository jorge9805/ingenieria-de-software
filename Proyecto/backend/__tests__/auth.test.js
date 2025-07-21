import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { testUtils } from './testUtils.js';
import testDb from './testDb.js';

const SECRET = 'test-secret';

// Mock del módulo db original
jest.mock('../db.js', () => ({
  default: {
    query: jest.fn().mockImplementation((sql, params) => {
      return require('./testDb.js').default.query(sql, params);
    })
  }
}));

// Mock del middleware de autenticación para rutas protegidas
const mockAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

jest.mock('../middleware/auth.js', () => mockAuth);

// Crear app de prueba para autenticación
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  const router = express.Router();

  // Registro de usuario
  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      // Validaciones básicas
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }

      const hash = await bcrypt.hash(password, 10);

      const result = await testDb.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash]
      );

      const userResult = await testDb.query(
        'SELECT id, username, email FROM users WHERE id = ?',
        [result.insertId]
      );

      const user = userResult.rows[0];
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        token
      });
    } catch (_err) {
      console.error('Error en /register:', _err);
      if (_err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'El usuario o email ya existe' });
      } else {
        res.status(500).json({ error: 'No se pudo registrar el usuario' });
      }
    }
  });

  // Login de usuario
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const result = await testDb.query('SELECT * FROM users WHERE email = ?', [email]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        token
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error del servidor' });
    }
  });

  // Actualizar perfil de usuario
  router.put('/profile', mockAuth, async (req, res) => {
    const { username, email, currentPassword, newPassword } = req.body;

    try {
      // Obtener usuario actual
      const userResult = await testDb.query(
        'SELECT * FROM users WHERE id = ?',
        [req.user.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const user = userResult.rows[0];

      // Verificar si el nuevo username o email ya están en uso por otro usuario
      if (username !== user.username) {
        const usernameCheck = await testDb.query(
          'SELECT id FROM users WHERE username = ? AND id != ?',
          [username, req.user.id]
        );
        if (usernameCheck.rows.length > 0) {
          return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }
      }

      if (email !== user.email) {
        const emailCheck = await testDb.query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, req.user.id]
        );
        if (emailCheck.rows.length > 0) {
          return res.status(400).json({ error: 'El email ya está en uso' });
        }
      }

      // Si se quiere cambiar la contraseña
      let hashedNewPassword = user.password; // Por defecto mantener la misma
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Debes proporcionar tu contraseña actual para cambiarla' });
        }

        if (newPassword.length < 6) {
          return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar contraseña actual
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
          return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
        }

        // Hash de la nueva contraseña
        hashedNewPassword = await bcrypt.hash(newPassword, 10);
      }

      // Actualizar usuario
      await testDb.query(
        'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
        [username, email, hashedNewPassword, req.user.id]
      );

      // Obtener el usuario actualizado
      const updatedResult = await testDb.query(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [req.user.id]
      );

      const updatedUser = updatedResult.rows[0];

      res.json({
        message: 'Perfil actualizado correctamente',
        user: updatedUser
      });
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
  });

  app.use('/api/auth', router);
  return app;
};

describe('Auth API Tests', () => {
  let app;

  beforeAll(async () => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await testUtils.cleanDatabase();
  });

  afterAll(async () => {
    await testUtils.closeDatabase();
  });

  describe('POST /api/auth/register - Registro de usuario', () => {
    test('Debe registrar un usuario correctamente', async () => {
      const newUser = {
        username: 'nuevousuario',
        email: 'nuevo@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        username: newUser.username,
        email: newUser.email
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.password).toBeUndefined(); // No debe incluir la contraseña
    });

    test('Debe validar campos requeridos', async () => {
      const incompleteUser = {
        username: 'test'
        // Falta email y password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('requeridos');
    });

    test('Debe validar longitud mínima de contraseña', async () => {
      const userWithShortPassword = {
        username: 'test',
        email: 'test@example.com',
        password: '123' // Muy corta
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithShortPassword);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('al menos 6 caracteres');
    });

    test('No debe permitir usuarios duplicados', async () => {
      const user = {
        username: 'duplicado',
        email: 'duplicado@example.com',
        password: 'password123'
      };

      // Registrar primera vez
      await request(app)
        .post('/api/auth/register')
        .send(user);

      // Intentar registrar de nuevo
      const response = await request(app)
        .post('/api/auth/register')
        .send(user);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('ya existe');
    });

    test('No debe permitir emails duplicados', async () => {
      const user1 = {
        username: 'usuario1',
        email: 'mismo@example.com',
        password: 'password123'
      };

      const user2 = {
        username: 'usuario2',
        email: 'mismo@example.com', // Mismo email
        password: 'password123'
      };

      // Registrar primera vez
      await request(app)
        .post('/api/auth/register')
        .send(user1);

      // Intentar registrar con mismo email
      const response = await request(app)
        .post('/api/auth/register')
        .send(user2);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('ya existe');
    });
  });

  describe('POST /api/auth/login - Login de usuario', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await testUtils.createTestUser({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123'
      });
    });

    test('Debe logear un usuario correctamente', async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        username: testUser.username,
        email: testUser.email
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    test('Debe fallar con email incorrecto', async () => {
      const loginData = {
        email: 'noexiste@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('no encontrado');
    });

    test('Debe fallar con contraseña incorrecta', async () => {
      const loginData = {
        email: testUser.email,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('incorrecta');
    });

    test('Debe validar campos requeridos', async () => {
      const incompleteLogin = {
        email: 'test@example.com'
        // Falta password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(incompleteLogin);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('requeridos');
    });
  });

  describe('PUT /api/auth/profile - Cambios de perfil', () => {
    let testUser;
    let authToken;

    beforeEach(async () => {
      testUser = await testUtils.createTestUser({
        username: 'profileuser',
        email: 'profile@example.com',
        password: 'password123'
      });
      authToken = testUtils.generateTestToken(testUser.id, testUser.username);
    });

    test('Debe cambiar nombre de usuario', async () => {
      const updateData = {
        username: 'nuevousername',
        email: testUser.email
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('actualizado correctamente');
      expect(response.body.user.username).toBe('nuevousername');
    });

    test('Debe cambiar correo electrónico', async () => {
      const updateData = {
        username: testUser.username,
        email: 'nuevo@example.com'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('nuevo@example.com');
    });

    test('Debe cambiar contraseña', async () => {
      const updateData = {
        username: testUser.username,
        email: testUser.email,
        currentPassword: testUser.password,
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('actualizado correctamente');

      // Verificar que la nueva contraseña funciona
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'newpassword123'
        });

      expect(loginResponse.status).toBe(200);
    });

    test('Debe fallar al cambiar contraseña sin proporcionar la actual', async () => {
      const updateData = {
        username: testUser.username,
        email: testUser.email,
        newPassword: 'newpassword123'
        // Falta currentPassword
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('contraseña actual');
    });

    test('Debe fallar con contraseña actual incorrecta', async () => {
      const updateData = {
        username: testUser.username,
        email: testUser.email,
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('incorrecta');
    });

    test('Debe validar longitud de nueva contraseña', async () => {
      const updateData = {
        username: testUser.username,
        email: testUser.email,
        currentPassword: testUser.password,
        newPassword: '123' // Muy corta
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('al menos 6 caracteres');
    });

    test('No debe permitir username duplicado', async () => {
      // Crear otro usuario
      const _otherUser = await testUtils.createTestUser({
        username: 'otrousuario',
        email: 'otro@example.com'
      });

      const updateData = {
        username: 'otrousuario', // Intentar usar username existente
        email: testUser.email
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('ya está en uso');
    });

    test('No debe permitir email duplicado', async () => {
      // Crear otro usuario
      const _otherUser = await testUtils.createTestUser({
        username: 'otrousuario',
        email: 'otro@example.com'
      });

      const updateData = {
        username: testUser.username,
        email: 'otro@example.com' // Intentar usar email existente
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('ya está en uso');
    });

    test('Debe fallar sin autenticación', async () => {
      const updateData = {
        username: 'newusername',
        email: 'new@example.com'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Token requerido');
    });
  });
});
