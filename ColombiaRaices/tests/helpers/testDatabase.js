// Test Database Helper - Mock Database for Unit Tests
// This file provides a test database setup for unit tests

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class TestDatabase {
  constructor() {
    this.db = null;
    this.isConnected = false;
  }

  // Connect to test database (in-memory)
  async connect() {
    if (this.isConnected) {
      return this.db;
    }

    try {
      // Use in-memory database for tests
      this.db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
          console.error('Error connecting to test database:', err);
          throw err;
        }
        console.log('Connected to test SQLite database (in-memory)');
        this.isConnected = true;
      });

      // Enable foreign keys
      this.db.run('PRAGMA foreign_keys = ON');
      
      // Create tables for testing
      await this.createTestTables();
      
      return this.db;
    } catch (error) {
      console.error('Test database connection failed:', error);
      throw error;
    }
  }

  // Create test tables
  async createTestTables() {
    const tables = [
      // Users table
      `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        user_type TEXT NOT NULL CHECK (user_type IN ('viajero', 'operador', 'admin')),
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )`,
      
      // Communities table
      `CREATE TABLE communities (
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
      )`,
      
      // Experiences table
      `CREATE TABLE experiences (
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
      )`,      // Reservations table
      `CREATE TABLE reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        experience_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        participants INTEGER NOT NULL,
        reservation_date DATETIME NOT NULL,
        total_price REAL NOT NULL,
        base_price REAL NOT NULL,
        service_price REAL DEFAULT 0,
        additional_services_cost REAL DEFAULT 0,
        group_discount REAL DEFAULT 0,
        discount_percentage REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        additional_services TEXT,
        services TEXT,
        cancellation_reason TEXT,
        cancelled_at DATETIME,
        FOREIGN KEY (experience_id) REFERENCES experiences (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`
    ];

    for (const sql of tables) {
      await this.run(sql);
    }
  }
  // Insert test data
  async insertTestData() {
    // Insert test users first (no foreign key dependencies)
    await this.run(`
      INSERT INTO users (id, email, password_hash, name, user_type, is_active)
      VALUES (1, 'test@example.com', 'hashedpassword', 'Test User', 'viajero', 1)
    `);    await this.run(`
      INSERT INTO users (id, email, password_hash, name, user_type, is_active)
      VALUES (2, 'test2@example.com', 'hashedpassword', 'Test User 2', 'viajero', 1)
    `);

    await this.run(`
      INSERT INTO users (id, email, password_hash, name, user_type, is_active)
      VALUES (3, 'test3@example.com', 'hashedpassword', 'Test User 3', 'viajero', 1)
    `);

    // Insert test community
    await this.run(`
      INSERT INTO communities (id, name, region, description, is_active)
      VALUES (1, 'Test Community', 'Test Region', 'Test Description', 1)
    `);

    // Insert test experience
    await this.run(`
      INSERT INTO experiences (id, title, description, community_id, operator_id, type, price, duration_hours, max_participants, is_active)
      VALUES (1, 'Test Experience', 'Test Description', 1, 1, 'cultural', 100.00, 4, 10, 1)
    `);    // Insert test reservations
    await this.run(`
      INSERT INTO reservations (id, experience_id, user_id, participants, reservation_date, total_price, base_price, service_price, additional_services_cost, group_discount, discount_percentage, discount_amount, status)
      VALUES (1, 1, 1, 2, '2025-08-01 10:00:00', 200.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'pending')
    `);

    await this.run(`
      INSERT INTO reservations (id, experience_id, user_id, participants, reservation_date, total_price, base_price, service_price, additional_services_cost, group_discount, discount_percentage, discount_amount, status)
      VALUES (2, 1, 1, 3, '2025-08-02 14:00:00', 300.00, 300.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'confirmed')
    `);

    // Insert a completed reservation for cancellation tests
    await this.run(`
      INSERT INTO reservations (id, experience_id, user_id, participants, reservation_date, total_price, base_price, service_price, additional_services_cost, group_discount, discount_percentage, discount_amount, status)
      VALUES (3, 1, 1, 2, '2025-07-15 10:00:00', 200.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'completed')
    `);

    // Insert a reservation for a different user
    await this.run(`
      INSERT INTO reservations (id, experience_id, user_id, participants, reservation_date, total_price, base_price, service_price, additional_services_cost, group_discount, discount_percentage, discount_amount, status)
      VALUES (4, 1, 2, 1, '2025-08-03 16:00:00', 100.00, 100.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'pending')
    `);
  }

  // Promisified database methods
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            this.isConnected = false;
            console.log('Test database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = TestDatabase;
