// Modelo de Usuario
const BaseModel = require('./BaseModel');
const bcrypt = require('bcryptjs');

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  // Crear usuario con hash de contraseña
  async createUser(userData) {
    const { password, ...otherData } = userData;
    
    // Hash de la contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    return await this.create({
      ...otherData,
      password_hash
    });
  }

  // Buscar usuario por email
  async findByEmail(email) {
    const sql = `SELECT * FROM ${this.tableName} WHERE email = ? AND is_active = 1`;
    return await this.db.get(sql, [email]);
  }

  // Verificar contraseña
  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Autenticar usuario
  async authenticate(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      return null;
    }

    const isValidPassword = await this.verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return null;
    }    // Remover hash de contraseña del resultado
    const { password_hash: _password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Buscar usuarios por tipo
  async findByUserType(userType) {
    return await this.findAll({ user_type: userType, is_active: 1 });
  }
  // Actualizar perfil (sin contraseña)
  async updateProfile(id, profileData) {
    // Excluir campos sensibles
    const { password: _password, password_hash: _password_hash, ...safeData } = profileData;
    return await this.update(id, safeData);
  }

  // Cambiar contraseña
  async changePassword(id, newPassword) {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    
    return await this.update(id, { password_hash });
  }

  // Buscar operadores activos
  async findActiveOperators() {
    return await this.findAll({ 
      user_type: 'operador', 
      is_active: 1 
    });
  }

  // Buscar administradores
  async findAdmins() {
    return await this.findAll({ 
      user_type: 'admin', 
      is_active: 1 
    });
  }
}

module.exports = UserModel;
