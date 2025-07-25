// Controlador de Autenticación - Integración con AuthService
const AuthService = require('../services/AuthService');
const { AuthObserver, AUTH_EVENTS } = require('../utils/AuthObserver');
const UserModel = require('../database/models/UserModel');

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.authObserver = new AuthObserver();
    this.userModel = new UserModel();
  }  // Registrar nuevo usuario
  async register(userData) {
    console.log('🔐 AuthController.register called with:', userData);
    try {
      // Validar datos del usuario
      console.log('📝 Validating user data...');
      const validation = this.authService.validateUserData(userData);
      console.log('✅ Validation result:', validation);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Verificar si el email ya existe en la base de datos
      console.log('📧 Checking if email exists...');
      const existingUser = await this.userModel.findByEmail(userData.email);
      console.log('🔍 Existing user check result:', existingUser);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear usuario en la base de datos
      console.log('👤 Creating user in database...');
      const newUser = await this.userModel.createUser({
        email: userData.email,
        name: userData.name,
        password: userData.password,        user_type: userData.userType || 'viajero',
        is_active: 1
      });
      console.log('✅ User created successfully:', newUser);

      // Generar token de sesión
      console.log('🔑 Generating token...');
      const token = this.authService.generateUserToken(newUser);
      console.log('✅ Token generated');

      // Notificar evento de registro
      console.log('📡 Notifying registration event...');
      this.authObserver.notify(AUTH_EVENTS.USER_REGISTER, {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        userType: newUser.user_type,        timestamp: new Date()
      });
      console.log('✅ Registration event notified');

      const result = {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          userType: newUser.user_type
        },
        token: token
      };
      console.log('🎉 Registration successful, returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }  // Autenticar usuario
  async login(email, password) {
    console.log('🔑 AuthController.login called with:', { email, password: '***' });
    try {
      // Validar email
      console.log('📧 Validating email...');
      const emailValidation = this.authService.validateEmail(email);
      console.log('✅ Email validation result:', emailValidation);
      if (!emailValidation.valid) {
        throw new Error('Email no válido');
      }

      // Autenticar usuario usando la base de datos
      console.log('🔍 Authenticating user...');
      const user = await this.userModel.authenticate(email, password);
      console.log('👤 Authentication result:', user ? 'User found' : 'User not found');
      if (!user) {
        throw new Error('Usuario no encontrado o contraseña incorrecta');
      }

      // Generar token de sesión
      console.log('🔑 Generating token...');
      const token = this.authService.generateUserToken(user);
      console.log('✅ Token generated');

      // Notificar evento de login
      console.log('📡 Notifying login event...');
      this.authObserver.notify(AUTH_EVENTS.USER_LOGIN, {
        userId: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,        timestamp: new Date()
      });
      console.log('✅ Login event notified');

      const result = {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.user_type
        },
        token: token
      };
      console.log('🎉 Login successful, returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cerrar sesión
  async logout(userId) {
    try {
      // Notificar evento de logout
      this.authObserver.notify(AUTH_EVENTS.USER_LOGOUT, {
        userId: userId,
        timestamp: new Date()
      });

      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }  }

}

module.exports = AuthController;
