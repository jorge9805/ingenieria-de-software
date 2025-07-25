// Singleton para gestión de base de datos SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.db = null;
    this.isConnected = false;
    Database.instance = this;
  }

  // Conectar a la base de datos
  async connect() {
    if (this.isConnected) {
      return this.db;
    }

    try {
      const dbPath = path.join(__dirname, '../../data/colombia_raices.db');
      const dbDir = path.dirname(dbPath);
      
      // Crear directorio si no existe
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error connecting to database:', err);
          throw err;
        }
        console.log('Connected to SQLite database');
        this.isConnected = true;
      });

      // Habilitar foreign keys
      this.db.run('PRAGMA foreign_keys = ON');
      
      return this.db;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  // Ejecutar query con promesas
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

  // Obtener un registro
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

  // Obtener múltiples registros
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

  // Cerrar conexión
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            this.isConnected = false;
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

// Exportar instancia singleton
module.exports = new Database();
