
const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const AuthService = require('../../../main/services/AuthService');
const bcrypt = require('bcryptjs');

describe('AuthService', () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    // Cleanup después de cada test
    authService = null;
  });

  describe('validatePassword', () => {
    it('should return true for valid password with minimum requirements', () => {
      const password = 'Colombia123!';
      const result = authService.validatePassword(password);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return false for password shorter than 8 characters', () => {
      const password = 'Col123!';
      const result = authService.validatePassword(password);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe tener al menos 8 caracteres');
    });

    it('should return false for password without uppercase letter', () => {
      const password = 'colombia123!';
      const result = authService.validatePassword(password);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe contener al menos una letra mayúscula');
    });

    it('should return false for password without lowercase letter', () => {
      const password = 'COLOMBIA123!';
      const result = authService.validatePassword(password);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe contener al menos una letra minúscula');
    });

    it('should return false for password without number', () => {
      const password = 'Colombia!';
      const result = authService.validatePassword(password);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe contener al menos un número');
    });

    it('should return false for password without special character', () => {
      const password = 'Colombia123';
      const result = authService.validatePassword(password);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe contener al menos un carácter especial');
    });

    it('should return multiple errors for invalid password', () => {
      const password = 'col';
      const result = authService.validatePassword(password);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'Colombia123!';
      const hashedPassword = await authService.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'Colombia123!';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'Colombia123!';
      const hashedPassword = await authService.hashPassword(password);
      
      const isValid = await authService.verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'Colombia123!';
      const wrongPassword = 'Colombia124!';
      const hashedPassword = await authService.hashPassword(password);
      
      const isValid = await authService.verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      const email = 'usuario@colombia.com';
      const result = authService.validateEmail(email);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return false for invalid email format', () => {
      const email = 'usuario-invalido';
      const result = authService.validateEmail(email);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Formato de email inválido');
    });

    it('should return false for empty email', () => {
      const email = '';
      const result = authService.validateEmail(email);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('El email es requerido');
    });
  });

  describe('generateUserToken', () => {
    it('should generate unique token for user', () => {
      const user = {
        id: 1,
        email: 'usuario@colombia.com',
        role: 'traveler'
      };
      
      const token = authService.generateUserToken(user);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(10);
    });

    it('should generate different tokens for different users', () => {
      const user1 = { id: 1, email: 'usuario1@colombia.com', role: 'traveler' };
      const user2 = { id: 2, email: 'usuario2@colombia.com', role: 'operator' };
      
      const token1 = authService.generateUserToken(user1);
      const token2 = authService.generateUserToken(user2);
      
      expect(token1).not.toBe(token2);
    });
  });
  describe('validateUserData', () => {
    it('should validate complete user data', () => {
      const userData = {
        name: 'Juan Pérez',
        email: 'juan@colombia.com',
        password: 'Colombia123!',
        userType: 'viajero'
      };
      
      const result = authService.validateUserData(userData);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for incomplete user data', () => {
      const userData = {
        name: '',
        email: 'email-invalido',
        password: '123',
        role: 'invalid-role'
      };
      
      const result = authService.validateUserData(userData);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
