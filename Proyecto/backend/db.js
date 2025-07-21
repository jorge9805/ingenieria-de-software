// backend/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorio para la base de datos si no existe
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'turismo.db');

// Función para abrir la conexión a la base de datos
async function openDB() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

// Función auxiliar: verifica si existe una columna en una tabla
async function columnExists(db, tableName, columnName) {
  const result = await db.all(`PRAGMA table_info(${tableName})`);
  return result.some(col => col.name === columnName);
}

// Agregar columna solo si no existe
async function addColumnIfNotExists(db, tableName, columnName, columnType) {
  const exists = await columnExists(db, tableName, columnName);
  if (!exists) {
    await db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
    console.log(`✅ Columna '${columnName}' agregada a la tabla '${tableName}'`);
  } else {
    console.log(`ℹ️ Columna '${columnName}' ya existe en '${tableName}', no se agregó.`);
  }
}

// Función para inicializar la base de datos con las tablas
async function initializeDatabase() {
  const db = await openDB();
  
  // Crear tablas si no existen
  await db.exec(`
    -- Crear tabla de usuarios
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Crear tabla de posts
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Crear tabla de favoritos
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      post_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      UNIQUE(user_id, post_id)
    );

    -- Crear tabla de comentarios
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      user_id INTEGER,
      post_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `);

  // 🔹 Migraciones: agregar columnas nuevas al perfil si no existen
  await addColumnIfNotExists(db, "users", "first_name", "TEXT");
  await addColumnIfNotExists(db, "users", "last_name", "TEXT");
  await addColumnIfNotExists(db, "users", "identification_document", "TEXT");
  await addColumnIfNotExists(db, "users", "telephone", "TEXT");
  await addColumnIfNotExists(db, "users", "address", "TEXT");
  await addColumnIfNotExists(db, "users", "nationality", "TEXT");

  // Verificar si ya hay datos, si no insertar datos de ejemplo
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  
  if (userCount.count === 0) {
    console.log('🌱 Insertando datos de ejemplo...');
    
    // Insertar usuarios de ejemplo (contraseña: "demo123")
    await db.run(`
      INSERT INTO users (username, email, password) VALUES 
      ('demo_user', 'demo@turismo.com', '$2b$10$cjail1EQNXw3AdzemPAyX.yaEqD4HSHJko0p5ZSXLKe/i.EAXU5au'),
      ('turista1', 'turista@ejemplo.com', '$2b$10$8X2rY9vZ/B.fA6wL0nP3COrDx4K.5qY7mW3nR8sT1uV2pE9cF6gHm')
    `);

    // Insertar posts de ejemplo
    await db.run(`
      INSERT INTO posts (title, description, image_url, user_id) VALUES 
      ('Machu Picchu, Perú', 'Una de las nuevas siete maravillas del mundo, esta antigua ciudad inca ofrece vistas espectaculares y una rica historia que data del siglo XV. Ubicada en los Andes peruanos, es uno de los destinos más impresionantes del mundo.', 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1),
      ('Torre Eiffel, París', 'El icónico símbolo de París ofrece vistas panorámicas de la ciudad luz desde sus diferentes niveles. Construida en 1889, esta estructura de hierro de 330 metros de altura es uno de los monumentos más visitados del mundo.', 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1),
      ('Santorini, Grecia', 'Hermosas casas blancas con techos azules, atardeceres espectaculares y vistas al mar Egeo. Esta isla volcánica en el archipiélago de las Cícladas es famosa por sus pueblos pintorescos y sus increíbles puestas de sol.', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 2),
      ('Gran Muralla China', 'Una de las construcciones más impresionantes de la humanidad, extendiéndose por más de 21,000 kilómetros a través del territorio chino. Esta antigua fortificación ofrece vistas espectaculares y una experiencia histórica única.', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1),
      ('Taj Mahal, India', 'Este magnífico mausoleo de mármol blanco en Agra es considerado una de las más bellas obras maestras de la arquitectura mogol. Construido entre 1632 y 1648, es símbolo del amor eterno.', 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 2),
      ('Coliseo Romano, Italia', 'El anfiteatro más grande jamás construido, ubicado en el centro de Roma. Esta maravilla arquitectónica del Imperio Romano podía albergar entre 50,000 y 80,000 espectadores y es un testimonio de la grandeza antigua.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1)
    `);

    // Insertar comentarios de ejemplo
    await db.run(`
      INSERT INTO comments (content, rating, user_id, post_id) VALUES 
      ('¡Increíble experiencia! Las vistas son absolutamente espectaculares y la historia del lugar es fascinante.', 5, 2, 1),
      ('Un lugar que todos deberían visitar al menos una vez en la vida. La subida es exigente pero vale la pena.', 5, 1, 1),
      ('París es mágico, y la Torre Eiffel es simplemente icónica. Las vistas desde arriba son impresionantes.', 4, 2, 2),
      ('Los atardeceres en Santorini son de otro mundo. Un destino perfecto para una luna de miel.', 5, 1, 3),
      ('La Gran Muralla es impresionante por su extensión y conservación. Una maravilla de la ingeniería antigua.', 4, 2, 4)
    `);

    // Insertar favoritos de ejemplo
    await db.run(`
      INSERT INTO favorites (user_id, post_id) VALUES 
      (1, 1),
      (1, 3),
      (2, 2),
      (2, 4)
    `);

    console.log('✅ Datos de ejemplo insertados exitosamente');
  }

  return db;
}

// Exportar función para obtener la base de datos
export { openDB, initializeDatabase };

// Instancia única de la base de datos
let dbInstance = null;

export default {
  async query(sql, params = []) {
    if (!dbInstance) {
      dbInstance = await initializeDatabase();
    }
    
    // Para consultas SELECT
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return { rows: await dbInstance.all(sql, params) };
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
  }
};
