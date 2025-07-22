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
    await db.exec('ALTER TABLE posts ADD COLUMN keywords TEXT DEFAULT \'\';');
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
    ('Caminata Espiritual en la Sierra Nevada', 'Sendero guiado por mamos Kogui con paradas para rituales y conexión con la naturaleza. Incluye refrigerio.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiSyBDMmdLe7FJo501eVM7-zdBxyevQ0psXA&s', 'colombia, sierra nevada, kogui, espiritual, trekking, naturaleza, caribe', 1),
    ('Taller de Tejido Wayuu en La Guajira', 'Taller práctico de tejido de mochilas, guiado por mujeres Wayuu. Incluye materiales, refrigerio y souvenir.', 'https://artesaniasdecolombia.com.co/Documentos/Contenido/37975_mes-madre-carmen-maria-gonzalez-artesanias-colombia-2021-g.jpg', 'colombia, guajira, wayuu, tejido, cultural, artesania, caribe', 2),
    ('Ruta Desértica a Punta Gallinas', 'Recorrido en 4x4 con guía Wayuu por paisajes desérticos, miradores, Cabo de la Vela y Punta Gallinas. Incluye almuerzo típico.', 'https://alkilautos.com/blog/wp-content/uploads/2017/08/17.08.15-Punta-Gallinas-Cabo-de-la-vela.jpg', 'colombia, desierto, guajira, aventura, 4x4, paisajes, caribe', 1),
    ('Ruta Agroecológica Misak en el Cauca', 'Caminata guiada por cultivos de altura con explicación de técnicas tradicionales y consumo de alimentos locales.', 'https://aventurecolombia.com/wp-content/uploads/2020/11/misak-guambianos-colombie-14.jpg', 'colombia, cauca, misak, agroecologia, andes, montaña, cultural', 2),
    ('Visita a los Hipogeos de Tierradentro', 'Recorrido por tumbas subterráneas ancestrales (hipogeos) con interpretación espiritual y cultural por guía Nasa.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDKxUPTNEt1eMJnQKPZV8POHG6C6ma2tFT8A&s', 'colombia, cauca, nasa, historia, arqueologia, unesco, andes', 1)
  `);

  // Obtener los IDs de los posts recién insertados para vincular correctamente los comentarios
  const posts = await db.all('SELECT id, title FROM posts ORDER BY id');
  console.log('📋 Posts insertados:', posts.map(p => `${p.id}: ${p.title}`));

  // Insertar comentarios de ejemplo vinculados a los posts correctos
  if (posts.length >= 5) {
    console.log('💬 Insertando comentarios de ejemplo...');
    await db.run(`
      INSERT INTO comments (content, rating, user_id, post_id) VALUES 
      ('Una conexión total con la madre tierra. Los mamos Kogui transmiten una sabiduría profunda. Experiencia inolvidable.', 5, 2, ?),
      ('La caminata fue exigente pero valió la pena. Los rituales ancestrales son muy emotivos.', 4, 1, ?),
      ('Aprendí mucho sobre la cultura Wayuu y me llevé una mochila hermosa que tejí yo misma. ¡Increíble!', 5, 1, ?),
      ('Las mujeres Wayuu son maestras artesanas. El taller es muy didáctico y divertido.', 5, 2, ?),
      ('El desierto de La Guajira es de otro mundo. Un viaje que te cambia la perspectiva.', 5, 2, ?),
      ('Los paisajes desérticos son espectaculares. La experiencia con los guías Wayuu fue enriquecedora.', 4, 1, ?),
      ('Ver cómo cultivan los Misak de forma sostenible fue muy inspirador. ¡Y la comida deliciosa!', 5, 1, ?),
      ('La agricultura tradicional Misak es fascinante. Aprendí técnicas ancestrales increíbles.', 4, 2, ?),
      ('Los hipogeos son impresionantes. Un tesoro arqueológico que hay que preservar. Muy recomendado.', 5, 2, ?),
      ('La interpretación de los guías Nasa es excelente. Historia viva que te emociona.', 5, 1, ?)
    `, [posts[0].id, posts[0].id, posts[1].id, posts[1].id, posts[2].id, posts[2].id, posts[3].id, posts[3].id, posts[4].id, posts[4].id]);
  }

  // Insertar favoritos de ejemplo vinculados a los posts correctos
  if (posts.length >= 5) {
    console.log('❤️ Insertando favoritos de ejemplo...');
    await db.run(`
      INSERT INTO favorites (user_id, post_id) VALUES 
      (1, ?),
      (2, ?),
      (1, ?),
      (2, ?),
      (1, ?),
      (2, ?),
      (1, ?),
      (2, ?)
    `, [posts[0].id, posts[1].id, posts[2].id, posts[3].id, posts[4].id, posts[0].id, posts[1].id, posts[2].id]);
  }

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
