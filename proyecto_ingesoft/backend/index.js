import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeDatabase } from './db.js'
import postRoutes from './routes/posts.js'
import authRoutes from './routes/auth.js'
import commentsRoutes from './routes/comments.js'
import favoritesRoutes from './routes/favorites.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// Inicializar base de datos SQLite
async function startServer() {
  try {
    console.log('🔧 Inicializando base de datos SQLite...')
    await initializeDatabase()
    console.log('✅ Base de datos SQLite configurada exitosamente')
    
    // Rutas
    app.use('/api/auth', authRoutes)
    app.use('/api/posts', postRoutes)
    app.use('/api/comments', commentsRoutes)
    app.use('/api/favorites', favoritesRoutes)

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`)
      console.log('📁 Base de datos SQLite: backend/database/turismo.db')
      console.log('👤 Usuario demo: demo@turismo.com / demo123')
    })
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error)
    process.exit(1)
  }
}

startServer()