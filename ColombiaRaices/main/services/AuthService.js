
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class AuthService {
  constructor() {
    this.saltRounds = 12;
  }

  /**
   * Valida una contraseña según criterios de seguridad
   * @param {string} password - Contraseña a validar
   * @returns {object} - {valid: boolean, errors: array}
   */
  validatePassword(password) {
    const errors = [];
    
    if (!password || password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Hashea una contraseña usando bcrypt
   * @param {string} password - Contraseña a hashear
   * @returns {Promise<string>} - Contraseña hasheada
   */
  async hashPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error al hashear la contraseña: ' + error.message);
    }
  }

  /**
   * Verifica una contraseña contra su hash
   * @param {string} password - Contraseña en texto plano
   * @param {string} hashedPassword - Contraseña hasheada
   * @returns {Promise<boolean>} - true si coincide, false si no
   */
  async verifyPassword(password, hashedPassword) {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword);
      return isValid;
    } catch (error) {
      throw new Error('Error al verificar la contraseña: ' + error.message);
    }
  }

  /**
   * Valida formato de email
   * @param {string} email - Email a validar
   * @returns {object} - {valid: boolean, errors: array}
   */
  validateEmail(email) {
    const errors = [];
    
    if (!email || email.trim() === '') {
      errors.push('El email es requerido');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Formato de email inválido');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Genera un token único para el usuario
   * @param {object} user - Objeto usuario
   * @returns {string} - Token generado
   */
  generateUserToken(user) {
    const timestamp = Date.now();
    const userData = JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      timestamp
    });
    
    const token = crypto.createHash('sha256')
      .update(userData + Math.random().toString(36))
      .digest('hex');
    
    return token;
  }
  /**
   * Valida datos completos del usuario
   * @param {object} userData - Datos del usuario
   * @returns {object} - {valid: boolean, errors: array}
   */
  validateUserData(userData) {
    const errors = [];
    
    // Validar nombre
    if (!userData.name || userData.name.trim() === '') {
      errors.push('El nombre es requerido');
    }
    
    // Validar email
    const emailValidation = this.validateEmail(userData.email);
    if (!emailValidation.valid) {
      errors.push(...emailValidation.errors);
    }
    
    // Validar contraseña
    const passwordValidation = this.validatePassword(userData.password);
    if (!passwordValidation.valid) {
      errors.push(...passwordValidation.errors);
    }
    
    // Validar userType (instead of role)
    const validUserTypes = ['viajero', 'operador', 'admin'];
    if (!userData.userType || !validUserTypes.includes(userData.userType)) {
      errors.push('Tipo de usuario inválido. Debe ser: viajero, operador o admin');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Autentica un usuario (placeholder para conectar con base de datos)
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<object>} - Resultado de autenticación
   */
  async authenticateUser(email, password) {
    // TODO: Implementar en siguiente sprint cuando se conecte con base de datos
    const emailValidation = this.validateEmail(email);
    if (!emailValidation.valid) {
      return {
        success: false,
        errors: emailValidation.errors
      };
    }
    
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        errors: passwordValidation.errors
      };
    }
    
    // Placeholder - será implementado en el siguiente sprint
    return {
      success: true,
      user: null,
      token: null,
      message: 'Autenticación será implementada en el siguiente sprint'
    };
  }
}

module.exports = AuthService;
