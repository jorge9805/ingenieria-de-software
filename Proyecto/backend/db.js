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
      keywords TEXT, -- Palabras clave separadas por comas
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

  // Agregar la columna keywords si no existe
  try {
    await db.exec(`ALTER TABLE posts ADD COLUMN keywords TEXT DEFAULT '';`);
    console.log('✅ Columna keywords agregada a la tabla posts');
  } catch (err) {
    // La columna ya existe, no es un error
    if (!err.message.includes('duplicate column name')) {
      console.error('Error agregando columna keywords:', err);
    }
  }

  // Verificar si ya hay datos, si no insertar datos de ejemplo
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  
  // Siempre eliminar posts existentes y crear nuevos con keywords
  console.log('🗑️ Eliminando posts existentes...');
  await db.run('DELETE FROM comments');
  await db.run('DELETE FROM favorites'); 
  await db.run('DELETE FROM posts');
  
  if (userCount.count === 0) {
    console.log('🌱 Insertando usuarios de ejemplo...');
    
    // Insertar usuarios de ejemplo (contraseña: "demo123")
    await db.run(`
      INSERT INTO users (username, email, password) VALUES 
      ('demo_user', 'demo@turismo.com', '$2b$10$cjail1EQNXw3AdzemPAyX.yaEqD4HSHJko0p5ZSXLKe/i.EAXU5au'),
      ('turista1', 'turista@ejemplo.com', '$2b$10$8X2rY9vZ/B.fA6wL0nP3COrDx4K.5qY7mW3nR8sT1uV2pE9cF6gHm')
    `);
  }

  console.log('🌱 Insertando nuevos posts con palabras clave...');

  // Insertar posts de ejemplo con keywords
  await db.run(`
    INSERT INTO posts (title, description, image_url, keywords, user_id) VALUES 
    ('Machu Picchu, Perú', 'Una de las nuevas siete maravillas del mundo, esta antigua ciudad inca ofrece vistas espectaculares y una rica historia que data del siglo XV. Ubicada en los Andes peruanos, es uno de los destinos más impresionantes del mundo.', 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'montaña, historia, inca, aventura, trekking, unesco, patrimonio', 1),
    ('Bali, Indonesia', 'Paraíso tropical con playas de arena blanca, templos antiguos y una cultura vibrante. Perfecto para relajarse y disfrutar de spas, yoga y la gastronomía balinesa en un entorno natural espectacular.', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'playa, tropical, spa, yoga, templos, relax, cultura, indonesia', 2),
    ('Islas Maldivas', 'Atolones de coral con aguas cristalinas color turquesa y villas sobre el agua. El destino perfecto para luna de miel, buceo y desconexión total del mundo en un paraíso tropical único.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'playa, buceo, luna de miel, lujo, coral, turquesa, villa, tropical', 1),
    ('Torres del Paine, Chile', 'Parque nacional patagónico con montañas escarpadas, lagos glaciares y fauna única. Ideal para trekking, fotografía de naturaleza y aventuras en uno de los paisajes más dramáticos del mundo.', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'montaña, trekking, patagonia, glaciar, aventura, naturaleza, chile, fauna', 2),
    ('Tokio, Japón', 'Metrópolis futurista que combina perfectamente tradición y modernidad. Desde templos antiguos hasta rascacielos brillantes, gastronomía excepcional y tecnología de vanguardia.', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'ciudad, tecnología, templos, gastronomía, moderno, tradicional, cultura, japón', 1)
  `);

  // Insertar comentarios de ejemplo
  await db.run(`
    INSERT INTO comments (content, rating, user_id, post_id) VALUES 
    ('¡Increíble experiencia! Las vistas son absolutamente espectaculares y la historia del lugar es fascinante.', 5, 2, 1),
    ('Un lugar que todos deberían visitar al menos una vez en la vida. La subida es exigente pero vale la pena.', 5, 1, 1),
    ('Bali es mágico, perfecto para desconectar. Los templos y la cultura son impresionantes.', 5, 2, 2),
    ('Las Maldivas superaron mis expectativas. El agua es increíblemente clara y las villas son de ensueño.', 5, 1, 3),
    ('Torres del Paine es perfecto para los amantes de la naturaleza. Los paisajes son simplemente épicos.', 4, 2, 4),
    ('Tokio es una ciudad que nunca duerme. La comida es increíble y la tecnología es impresionante.', 4, 1, 5)
  `);

  // Insertar favoritos de ejemplo
  await db.run(`
    INSERT INTO favorites (user_id, post_id) VALUES 
    (1, 1),
    (1, 3),
    (2, 2),
    (2, 4),
    (1, 5),
    (2, 1)
  `);

  console.log('✅ Nuevos datos con palabras clave insertados exitosamente');

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
    
    // Debug logs
    if (params.length > 1) {
      console.log('DB Query SQL:', sql);
      console.log('DB Query Params:', params);
    }
    
    // Para consultas SELECT
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const result = await dbInstance.all(sql, params);
      if (params.length > 1) {
        console.log('DB Query Results:', result.length, 'filas');
      }
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
  }
};
