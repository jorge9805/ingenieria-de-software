// Migraciones iniciales de la base de datos
const Database = require('../database');

class Migration {
  constructor() {
    this.db = Database;
  }

  // Ejecutar todas las migraciones
  async runMigrations() {
    try {
      await this.db.connect();
      
      // Crear tabla de migraciones si no existe
      await this.createMigrationsTable();      // Ejecutar migraciones pendientes
      await this.migration_001_create_users_table();
      await this.migration_002_create_communities_table();
      await this.migration_003_create_experiences_table();
      await this.migration_004_create_reservations_table();
      await this.migration_005_add_image_fields();
      await this.migration_006_add_location_fields_to_experiences();
      
      console.log('All migrations completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  // Crear tabla de control de migraciones
  async createMigrationsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await this.db.run(sql);
  }

  // Verificar si una migración ya fue ejecutada
  async isMigrationExecuted(name) {
    const result = await this.db.get(
      'SELECT id FROM migrations WHERE name = ?',
      [name]
    );
    return !!result;
  }

  // Marcar migración como ejecutada
  async markMigrationExecuted(name) {
    await this.db.run(
      'INSERT INTO migrations (name) VALUES (?)',
      [name]
    );
  }

  // Migración 001: Crear tabla de usuarios
  async migration_001_create_users_table() {
    const migrationName = '001_create_users_table';
    
    if (await this.isMigrationExecuted(migrationName)) {
      return;
    }

    const sql = `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        user_type TEXT NOT NULL CHECK (user_type IN ('viajero', 'operador', 'admin')),
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )
    `;
    
    await this.db.run(sql);
    await this.markMigrationExecuted(migrationName);
    console.log('Migration 001 completed: users table created');
  }

  // Migración 002: Crear tabla de comunidades
  async migration_002_create_communities_table() {
    const migrationName = '002_create_communities_table';
    
    if (await this.isMigrationExecuted(migrationName)) {
      return;
    }

    const sql = `
      CREATE TABLE communities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        region TEXT NOT NULL,
        description TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        address TEXT,
        latitude REAL,
        longitude REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )
    `;
    
    await this.db.run(sql);
    await this.markMigrationExecuted(migrationName);
    console.log('Migration 002 completed: communities table created');
  }

  // Migración 003: Crear tabla de experiencias
  async migration_003_create_experiences_table() {
    const migrationName = '003_create_experiences_table';
    
    if (await this.isMigrationExecuted(migrationName)) {
      return;
    }

    const sql = `
      CREATE TABLE experiences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        community_id INTEGER NOT NULL,
        operator_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('cultural', 'historica', 'ecologica')),
        price REAL NOT NULL,
        duration_hours INTEGER NOT NULL,
        max_participants INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        FOREIGN KEY (community_id) REFERENCES communities (id),
        FOREIGN KEY (operator_id) REFERENCES users (id)
      )
    `;
    
    await this.db.run(sql);
    await this.markMigrationExecuted(migrationName);
    console.log('Migration 003 completed: experiences table created');
  }

  // Migración 004: Crear tabla de reservas
  async migration_004_create_reservations_table() {
    const migrationName = '004_create_reservations_table';
    
    if (await this.isMigrationExecuted(migrationName)) {
      return;
    }

    const sql = `
      CREATE TABLE reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        experience_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        participants INTEGER NOT NULL,
        reservation_date DATETIME NOT NULL,
        total_price REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (experience_id) REFERENCES experiences (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;
      await this.db.run(sql);
    await this.markMigrationExecuted(migrationName);
    console.log('Migration 004 completed: reservations table created');
  }

  // Migración 005: Agregar campos de imagen
  async migration_005_add_image_fields() {
    const migrationName = '005_add_image_fields';
    
    if (await this.isMigrationExecuted(migrationName)) {
      return;
    }

    try {
      // Agregar campos de imagen a communities
      await this.db.run('ALTER TABLE communities ADD COLUMN image_url TEXT');
      await this.db.run('ALTER TABLE communities ADD COLUMN image_alt TEXT');
      
      // Agregar campos de imagen a experiences
      await this.db.run('ALTER TABLE experiences ADD COLUMN image_url TEXT');      await this.db.run('ALTER TABLE experiences ADD COLUMN thumbnail_url TEXT');
      await this.db.run('ALTER TABLE experiences ADD COLUMN image_alt TEXT');
      
      await this.markMigrationExecuted(migrationName);
      console.log('Migration 005 completed: image fields added');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('Migration 005: Image fields already exist');
      } else {
        throw error;
      }
    }
  }

  // Migración 006: Agregar campos de ubicación específica a experiences
  async migration_006_add_location_fields_to_experiences() {
    const migrationName = '006_add_location_fields_to_experiences';
    
    if (await this.isMigrationExecuted(migrationName)) {
      return;
    }

    try {
      // Ubicación específica (texto libre)
      await this.db.run('ALTER TABLE experiences ADD COLUMN specific_location TEXT');
      console.log('Added specific_location field to experiences table');
      
      // Coordenadas específicas para mapas futuros
      await this.db.run('ALTER TABLE experiences ADD COLUMN latitude REAL');
      await this.db.run('ALTER TABLE experiences ADD COLUMN longitude REAL');
      console.log('Added latitude/longitude fields to experiences table');
      
      await this.markMigrationExecuted(migrationName);
      console.log('Migration 006 completed: location fields added to experiences');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('Migration 006: Location fields already exist');
      } else {
        throw error;
      }
    }
  }
}

module.exports = Migration;
