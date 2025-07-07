-- ====================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS
-- TurismoApp - Aplicación de Turismo
-- ====================================

-- Crear la base de datos (ejecutar como superusuario)
CREATE DATABASE turismo_db;

-- Conectarse a la base de datos
\c turismo_db;

-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de favoritos
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Crear tabla de comentarios
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario de prueba (contraseña: "demo123")
INSERT INTO users (username, email, password) VALUES 
('demo_user', 'demo@turismo.com', '$2b$10$8X2rY9vZ/B.fA6wL0nP3COrDx4K.5qY7mW3nR8sT1uV2pE9cF6gHm'),
('turista1', 'turista@ejemplo.com', '$2b$10$8X2rY9vZ/B.fA6wL0nP3COrDx4K.5qY7mW3nR8sT1uV2pE9cF6gHm');

-- Insertar posts de ejemplo
INSERT INTO posts (title, description, image_url, user_id) VALUES 
('Machu Picchu, Perú', 'Una de las nuevas siete maravillas del mundo, esta antigua ciudad inca ofrece vistas espectaculares y una rica historia que data del siglo XV. Ubicada en los Andes peruanos, es uno de los destinos más impresionantes del mundo.', 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1),

('Torre Eiffel, París', 'El icónico símbolo de París ofrece vistas panorámicas de la ciudad luz desde sus diferentes niveles. Construida en 1889, esta estructura de hierro de 330 metros de altura es uno de los monumentos más visitados del mundo.', 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1),

('Santorini, Grecia', 'Hermosas casas blancas con techos azules, atardeceres espectaculares y vistas al mar Egeo. Esta isla volcánica en el archipiélago de las Cícladas es famosa por sus pueblos pintorescos y sus increíbles puestas de sol.', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 2),

('Gran Muralla China', 'Una de las construcciones más impresionantes de la humanidad, extendiéndose por más de 21,000 kilómetros a través del territorio chino. Esta antigua fortificación ofrece vistas espectaculares y una experiencia histórica única.', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1),

('Taj Mahal, India', 'Este magnífico mausoleo de mármol blanco en Agra es considerado una de las más bellas obras maestras de la arquitectura mogol. Construido entre 1632 y 1648, es símbolo del amor eterno.', 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 2),

('Coliseo Romano, Italia', 'El anfiteatro más grande jamás construido, ubicado en el centro de Roma. Esta maravilla arquitectónica del Imperio Romano podía albergar entre 50,000 y 80,000 espectadores y es un testimonio de la grandeza antigua.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1);

-- Insertar algunos comentarios de ejemplo
INSERT INTO comments (content, rating, user_id, post_id) VALUES 
('¡Increíble experiencia! Las vistas son absolutamente espectaculares y la historia del lugar es fascinante.', 5, 2, 1),
('Un lugar que todos deberían visitar al menos una vez en la vida. La subida es exigente pero vale la pena.', 5, 1, 1),
('París es mágico, y la Torre Eiffel es simplemente icónica. Las vistas desde arriba son impresionantes.', 4, 2, 2),
('Los atardeceres en Santorini son de otro mundo. Un destino perfecto para una luna de miel.', 5, 1, 3),
('La Gran Muralla es impresionante por su extensión y conservación. Una maravilla de la ingeniería antigua.', 4, 2, 4);

-- Insertar algunos favoritos de ejemplo
INSERT INTO favorites (user_id, post_id) VALUES 
(1, 1),
(1, 3),
(2, 2),
(2, 4);

-- Verificar que todo se creó correctamente
SELECT 'Usuarios creados:' as info, count(*) as cantidad FROM users;
SELECT 'Posts creados:' as info, count(*) as cantidad FROM posts;
SELECT 'Comentarios creados:' as info, count(*) as cantidad FROM comments;
SELECT 'Favoritos creados:' as info, count(*) as cantidad FROM favorites;

-- Mostrar algunos datos de ejemplo
SELECT 'Datos de ejemplo:' as info;
SELECT u.username, p.title as post_titulo 
FROM users u 
JOIN posts p ON u.id = p.user_id 
LIMIT 3;

ECHO 'Base de datos configurada exitosamente!';
