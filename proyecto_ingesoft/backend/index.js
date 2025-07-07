import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import postRoutes from './routes/posts.js'
import authRoutes from './routes/auth.js'
import commentsRoutes from './routes/comments.js'
import favoritesRoutes from './routes/favorites.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/favorites', favoritesRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`))