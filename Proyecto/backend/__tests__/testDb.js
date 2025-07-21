import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbInstance = null;

const initializeTestDatabase = async () => {
  const db = await open({
    filename: ':memory:', // Base de datos en memoria para tests
    driver: sqlite3.Database
  });

  // Crear las tablas necesarias
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      keywords TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, post_id),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
    );
  `);

  return db;
};

const testDb = {
  async getConnection() {
    if (!dbInstance) {
      dbInstance = await initializeTestDatabase();
    }
    return dbInstance;
  },

  async query(sql, params = []) {
    if (!dbInstance) {
      dbInstance = await initializeTestDatabase();
    }

    // Para consultas SELECT
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const result = await dbInstance.all(sql, params);
      return { rows: result };
    }

    // Para INSERT, UPDATE, DELETE
    const result = await dbInstance.run(sql, params);
    return {
      rows: [],
      rowCount: result.changes,
      insertId: result.lastID
    };
  },

  async close() {
    if (dbInstance) {
      await dbInstance.close();
      dbInstance = null;
    }
  },

  async reset() {
    if (dbInstance) {
      await dbInstance.exec(`
        DELETE FROM favorites;
        DELETE FROM comments;
        DELETE FROM posts;
        DELETE FROM users;
      `);
    }
  }
};

export default testDb;
