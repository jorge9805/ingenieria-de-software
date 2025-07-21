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
    (
      'Pueblo Kogui',
      'El pueblo Kogui habita la Sierra Nevada de Santa Marta, considerada un territorio sagrado. Conservan una cosmovisión espiritual basada en la armonía con la naturaleza. Se destacan por su organización ancestral, arquitectura en bahareque y saberes milenarios.',
      'https://imagenes.eltiempo.com/uploads/2023/07/04/64a44f6f93687.jpeg',
      'comunidad, sierra nevada, espiritualidad, naturaleza, ${'caribe'}',
      1
    ),
    (
      'Comunidad Wayuu',
      'El pueblo Wayuu es el más numeroso de Colombia y habita el desierto de La Guajira. Su cultura se expresa en el tejido de mochilas, la vida en rancherías y su fuerte identidad matriarcal.',
      'https://etniasdelmundo.com/wp-content/uploads/2018/06/wayuu-17.jpg',
      'comunidad, desierto, artesanía, cultura, ${'caribe'}',
      2
    ),
    (
      'Pueblo Misak (Guambianos)',
      'Habitan en el resguardo de Guambia, Silvia (Cauca). Se identifican por su vestimenta colorida y su agricultura en altura. Tienen un calendario cultural basado en rituales y cosechas.',
      'https://i.pinimg.com/originals/ee/4e/83/ee4e8367ddf1ba4115b74120e81bffb9.jpg',
      'comunidad, agricultura, rituales, cultura, ${'andina'}',
      1
    ),
    (
      'Comunidad Campesina de San José de Apartadó',
      'Comunidad de paz que ha resistido el conflicto armado a través de prácticas pacíficas, agroecología y memoria colectiva. Son un símbolo de dignidad campesina.',
      'https://telemedellin.tv/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-21-at-3.44.57-PM-1.jpeg',
      'comunidad, paz, agroecología, campesina, ${'andina'}',
      2
    ),
    (
      'Pueblo Nasa',
      'Pueblo indígena del suroccidente colombiano. En Tierradentro (Cauca), conservan la relación con los hipogeos ancestrales, la medicina tradicional y el control territorial indígena.',
      'https://nasaacin.org/wp-content/uploads/2018/03/congreso_acin6-1024x734-min.jpg',
      'comunidad, indígena, medicina tradicional, patrimonio, ${'andina'}',
      1
    ),

     (
      'Caminata Espiritual por la Sierra Nevada',
      'Sendero guiado por mamos Kogui con paradas para rituales y conexión con la naturaleza. Incluye refrigerio.',
      'https://th.bing.com/th/id/OSK.HEROENUuIqNT_l2_ecFlE9mG3FTjuUjrDOd45sT0BSyii2o?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
      'ecológica, espiritual, naturaleza, sierra nevada, kogui',
      1
    ),
    (
      'Visita Cultural a Comunidad Kogui',
      'Encuentro con familias Kogui para conocer su cosmovisión, viviendas, tejidos y alimentación ancestral.',
      'https://live.staticflickr.com/5498/10744732065_c55d3a51f9_b.jpg',
      'cultural, cosmovisión, tejidos, alimentación ancestral, kogui',
      2
    ),
    (
      'Taller de Tejido Wayuu',
      'Taller práctico de tejido de mochilas, guiado por mujeres Wayuu. Incluye materiales, refrigerio y souvenir.',
      'https://tse1.mm.bing.net/th/id/OIP.6syGRtr9sV_dwUU0GUtWQAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
      'cultural, tejido, artesanía, mochilas, wayuu',
      1
    ),
    (
      'Ruta Desértica a Punta Gallinas',
      'Recorrido en 4x4 con guía Wayuu por paisajes desérticos, miradores, Cabo de la Vela y Punta Gallinas. Incluye almuerzo típico.',
      'https://tse1.mm.bing.net/th/id/OIP.ZSX6CppRyzkdWx39X3k65wHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
      'ecológica, aventura, desierto, miradores, wayuu',
      2
    ),
    (
      'Ruta Agroecológica Misak',
      'Caminata guiada por cultivos de altura con explicación de técnicas tradicionales y consumo de alimentos locales.',
      'https://tse1.mm.bing.net/th/id/OIP.BND-gT2G04cXPzPv4NFYHgHaE8?pid=ImgDet&w=474&h=316&rs=1&o=7&rm=3',
      'ecológica, agroecología, cultivos, misak',
      1
    ),
    (
      'Taller de Cacao Orgánico Campesino',
      'Experiencia en finca con recorrido por el proceso del cacao: cultivo, fermentado, secado y elaboración artesanal de chocolate.',
      'https://i1.wp.com/dancinglion.us/cacao/wp-content/uploads/2016/01/Ecuador2.jpg?fit=1200%2C800&ssl=1',
      'cultural, cacao, finca, chocolate artesanal, campesina',
      1
    );
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
