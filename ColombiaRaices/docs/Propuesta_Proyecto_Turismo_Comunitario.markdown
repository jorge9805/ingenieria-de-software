# Propuesta de Proyecto: Plataforma de Turismo Comunitario "Colombia Raíces"

## 1. Introducción
**Nombre del proyecto**: Colombia Raíces  
**Descripción**: Colombia Raíces es una aplicación de escritorio diseñada para promover el turismo comunitario en regiones marginadas de Colombia, conectando viajeros con experiencias auténticas ofrecidas por comunidades indígenas, campesinas y locales en destinos poco conocidos, como La Guajira, Chocó, Amazonía y pueblos patrimonio (e.g., Barichara, Mompox). La aplicación permite a los usuarios explorar experiencias turísticas (talleres culturales, caminatas guiadas, visitas históricas), generar estimaciones de reservas y conocer comunidades locales, mientras que los operadores comunitarios pueden publicar sus experiencias. La plataforma busca visibilizar regiones marginadas, fomentar el turismo sostenible y apoyar el desarrollo económico de estas comunidades.

**Problema**: Muchas regiones de Colombia, ricas en patrimonio cultural, histórico y natural, carecen de visibilidad turística debido a su marginalidad geográfica o social. Esto limita las oportunidades económicas para las comunidades locales y perpetúa la desigualdad. Las plataformas turísticas existentes suelen centrarse en destinos comerciales, ignorando el potencial de experiencias auténticas en comunidades indígenas o rurales.

**Justificación**: Colombia Raíces aborda un problema realista y acotado al promover el turismo comunitario en regiones marginadas, ofreciendo una solución tecnológica que conecta viajeros con experiencias auténticas. El proyecto cumple con las restricciones de la asignatura al implementarse como una arquitectura monolítica, usar una base de datos relacional (SQLite) y seguir el ciclo completo de desarrollo de software, incluyendo análisis de requerimientos, diseño, desarrollo, pruebas y documentación.

## 2. Objetivos
### Objetivo General
Desarrollar una aplicación de escritorio monolítica que promueva el turismo comunitario en regiones marginadas de Colombia, permitiendo a los usuarios explorar experiencias turísticas, generar estimaciones de reservas y conectar con comunidades locales, siguiendo principios de ingeniería de software (Clean Code, patrones de diseño, testing).

### Objetivos Específicos
1. Diseñar e implementar una aplicación con arquitectura monolítica usando Electron, JavaScript, Tailwind CSS y SQLite.
2. Permitir a los usuarios buscar y filtrar experiencias turísticas por región, tipo (cultural, histórica, ecológica) y presupuesto.
3. Habilitar la generación de estimaciones de reservas basadas en reglas de negocio definidas.
4. Permitir a operadores comunitarios (o administradores) publicar experiencias con descripciones, fotos y precios estimados.
5. Integrar mapas interactivos (usando OpenStreetMap) como funcionalidad complementaria para mostrar ubicaciones.
6. Aplicar el ciclo completo de desarrollo de software, incluyendo análisis de requerimientos, diseño con patrones, desarrollo, pruebas y documentación.

## 3. Alcance
- **Funcionalidades principales**:
  - Registro y autenticación de usuarios (viajeros y operadores comunitarios).
  - Búsqueda y filtrado de experiencias turísticas por región, tipo y presupuesto.
  - Generación de estimaciones de reservas con cálculos basados en duración, tipo de experiencia y servicios.
  - Publicación y validación de experiencias por parte de operadores comunitarios (con revisión administrativa simulada).
  - Visualización de perfiles de comunidades (historia, cultura, fotos).
  - Mapas interactivos para mostrar ubicaciones de experiencias (usando OpenStreetMap).
- **Limitaciones**:
  - No se procesan pagos ni se realizan reservas reales.
  - El proyecto se centra en 3-5 regiones marginadas (e.g., La Guajira, Chocó, Amazonía, Barichara).
  - No se exponen APIs públicas; las APIs externas (e.g., OpenStreetMap) son complementarias.
  - La aplicación es de escritorio, no web ni móvil.

## 4. Requerimientos Funcionales
1. **RF1**: El sistema debe permitir a los usuarios registrarse y autenticarse con email y contraseña.
2. **RF2**: El sistema debe permitir a los viajeros buscar experiencias por región, tipo (cultural, histórica, ecológica) y presupuesto.
3. **RF3**: El sistema debe generar estimaciones de reservas basadas en la duración, tipo de experiencia y servicios incluidos.
4. **RF4**: El sistema debe permitir a los operadores comunitarios subir experiencias (nombre, descripción, fotos, precio estimado) con un proceso de validación administrativa.
5. **RF5**: El sistema debe mostrar perfiles de comunidades con información cultural e histórica.
6. **RF6**: El sistema debe integrar mapas interactivos para mostrar ubicaciones de experiencias.

## 5. Requerimientos No Funcionales
1. **RNF1**: La aplicación debe tener una arquitectura monolítica implementada con Electron, JavaScript, Tailwind CSS y SQLite.
2. **RNF2**: La interfaz debe ser visualmente atractiva, usando Tailwind CSS con un diseño inspirado en la diversidad cultural de Colombia.
3. **RNF3**: El código debe seguir principios de Clean Code (nombres descriptivos, funciones cortas, modularidad).
4. **RNF4**: El sistema debe incluir pruebas unitarias y de integración para garantizar la calidad.
5. **RNF5**: La aplicación debe ser portable y fácil de instalar en sistemas Windows, macOS y Linux.
6. **RNF6**: La base de datos debe garantizar integridad referencial y estar normalizada.

## 6. Arquitectura
- **Tipo**: Monolítica.
- **Tecnologías**:
  - **Frontend**: Electron con React para componentes reutilizables y Tailwind CSS para estilos visuales.
  - **Backend**: Node.js dentro de Electron para la lógica de negocio y acceso a datos.
  - **Base de datos**: SQLite para almacenar usuarios, experiencias, comunidades y reservas.
  - **APIs externas**: OpenStreetMap (usando Leaflet) para mapas interactivos como funcionalidad complementaria.
- **Patrones de diseño**:
  - **MVC**: Separar la interfaz (React), la lógica (Node.js) y los datos (SQLite).
  - **Repository**: Encapsular el acceso a SQLite para consultas y operaciones.
  - **Singleton**: Gestionar la conexión a la base de datos.
- **Estructura**: El proceso principal de Electron maneja la lógica de negocio y la conexión a SQLite, mientras que el renderer gestiona la interfaz con React y Tailwind CSS.

## 7. Diseño de la Base de Datos
- **Esquema relacional** (SQLite):
  ```sql
  CREATE TABLE Comunidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      region TEXT NOT NULL,
      descripcion TEXT,
      fotos TEXT
  );
  CREATE TABLE Experiencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comunidad_id INTEGER,
      nombre TEXT NOT NULL,
      tipo TEXT CHECK(tipo IN ('cultural', 'historica', 'ecologica')),
      descripcion TEXT,
      precio_estimado REAL NOT NULL,
      duracion INTEGER NOT NULL,
      estado TEXT CHECK(estado IN ('pendiente', 'aprobada', 'rechazada')),
      FOREIGN KEY (comunidad_id) REFERENCES Comunidades(id)
  );
  CREATE TABLE Usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      contraseña TEXT NOT NULL,
      tipo TEXT CHECK(tipo IN ('viajero', 'operador'))
  );
  CREATE TABLE Reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      experiencia_id INTEGER,
      fecha TEXT NOT NULL,
      estado TEXT CHECK(estado IN ('pendiente', 'confirmada', 'cancelada')),
      FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
      FOREIGN KEY (experiencia_id) REFERENCES Experiencias(id)
  );
  ```
- **Descripción**:
  - `Comunidades`: Almacena información sobre las comunidades (e.g., Wayúu, Emberá).
  - `Experiencias`: Detalles de las experiencias turísticas (e.g., taller de artesanías, caminata guiada).
  - `Usuarios`: Viajeros (para reservas) y operadores (para subir experiencias).
  - `Reservas`: Estimaciones de reservas con estado y fechas.

## 8. Metodología de Desarrollo
- **Ciclo de vida**: Modelo en cascada adaptado, con las siguientes fases:
  - **Análisis de requerimientos**: Historias de usuario y casos de uso basados en entrevistas con viajeros y operadores comunitarios (simuladas).
  - **Diseño**: Diagramas UML (casos de uso, clases, entidad-relación) y diseño de la interfaz.
  - **Desarrollo**: Implementación en Electron, React, Tailwind CSS y SQLite, siguiendo Clean Code.
  - **Pruebas**: Pruebas unitarias (con Jest para funciones de negocio) y de integración (para flujos completos, e.g., crear una reserva).
  - **Documentación**: Manual de usuario, diagramas UML y descripción de la arquitectura.
- **Herramientas**:
  - **Desarrollo**: Visual Studio Code, Electron, Node.js, React, Tailwind CSS, SQLite.
  - **Pruebas**: Jest para pruebas unitarias y de integración.
  - **Documentación**: Markdown para manuales y diagramas UML generados con herramientas como PlantUML.

## 9. Entregables
1. Documento de requerimientos con historias de usuario y casos de uso.
2. Diagramas UML (casos de uso, clases, entidad-relación).
3. Código fuente de la aplicación (monolítica, en Electron con SQLite).
4. Pruebas unitarias y de integración con reportes de resultados.
5. Manual de usuario con instrucciones para instalar y usar la aplicación.
6. Documentación técnica de la arquitectura y el diseño.

## 10. Impacto Esperado
- **Social**: Visibilizar regiones marginadas de Colombia, promoviendo el turismo sostenible y el desarrollo económico de comunidades locales.
- **Técnico**: Demostrar la aplicación de conceptos de ingeniería de software (análisis, diseño, Clean Code, patrones, testing) en una solución monolítica.
- **Académico**: Cumplir con las restricciones del proyecto y destacar por su originalidad y enfoque social.