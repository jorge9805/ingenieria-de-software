import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostDetail from './pages/PostDetail'
import AddPost from './pages/AddPost'
import CommentForm from './pages/CommentForm'

// Componente para proteger rutas que requieren autenticación
function ProtectedRoute({ children, user, redirectTo = "/" }) {
  return user ? children : <Navigate to={redirectTo} replace />
}

// Componente para redireccionar usuarios logueados desde páginas de auth
function AuthRoute({ children, user, redirectTo = "/" }) {
  return !user ? children : <Navigate to={redirectTo} replace />
}

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('username'))
  const [userId, setUserId] = useState(() => {
    // Intentar obtener el userId del localStorage primero
    const savedUserId = localStorage.getItem('userId')
    console.log('Inicializando userId, savedUserId:', savedUserId)
    if (savedUserId && savedUserId !== 'undefined') return savedUserId
    
    // Si no existe, intentar extraerlo del token
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const id = payload.id
        console.log('ID extraído del token:', id)
        return id ? String(id) : null
      } catch (error) {
        console.log('No se pudo extraer userId del token')
        return null
      }
    }
    return null
  })
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [refreshPosts, setRefreshPosts] = useState(0)
  const location = useLocation()

  // Debug para userId
  useEffect(() => {
    console.log('userId actualizado:', userId)
  }, [userId])

  const triggerRefresh = () => setRefreshPosts(prev => prev + 1)

  // Forzar limpieza de tokens inválidos
  useEffect(() => {
    const forceCleanInvalidTokens = () => {
      const savedToken = localStorage.getItem('token')
      if (savedToken) {
        try {
          // Verificar si el token parece válido (estructura básica)
          const parts = savedToken.split('.')
          if (parts.length !== 3) {
            console.log('Token malformado, limpiando...')
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            localStorage.removeItem('userId')
            setUser(null)
            setToken(null)
            setUserId(null)
          }
        } catch (error) {
          console.log('Error verificando token, limpiando...')
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          localStorage.removeItem('userId')
          setUser(null)
          setToken(null)
          setUserId(null)
        }
      }
    }
    
    forceCleanInvalidTokens()
  }, [])

  // Validar token al iniciar la aplicación
  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('username')
      
      if (savedToken && savedUser) {
        try {
          // Verificar si el token es válido probando una función protegida (favoritos)
          const response = await fetch('http://localhost:4000/api/favorites', {
            headers: { 
              Authorization: `Bearer ${savedToken}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            // Token válido, mantener sesión
            setUser(savedUser)
            setToken(savedToken)
          } else {
            // Token inválido, limpiar todo
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            localStorage.removeItem('userId')
            setUser(null)
            setToken(null)
            setUserId(null)
          }
        } catch (error) {
          // Error de conexión, limpiar sesión por seguridad
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          localStorage.removeItem('userId')
          setUser(null)
          setToken(null)
          setUserId(null)
        }
      } else {
        // No hay token o usuario guardado
        setUser(null)
        setToken(null)
        setUserId(null)
      }
    }

    validateToken()
  }, [])

  // Actualizar localStorage cuando cambien user/token/userId
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('username', user)
      localStorage.setItem('token', token)
      if (userId) {
        localStorage.setItem('userId', userId)
      }
    } else {
      localStorage.removeItem('username')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    }
  }, [user, token, userId])

  // Logout function
  const handleLogout = () => {
    setUser(null)
    setUserId(null)
    setToken(null)
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }

  return (
    <div className="app">
      <Navbar 
        user={user} 
        setUser={setUser} 
        setToken={setToken}
        onLogout={handleLogout}
        currentPath={location.pathname}
      />
      <main className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route 
            path="/" 
            element={
              <Home 
                user={user} 
                userId={userId}
                token={token} 
                refreshPosts={refreshPosts} 
              />
            } 
          />
          
          {/* Rutas de autenticación - solo para usuarios no logueados */}
          <Route 
            path="/login" 
            element={
              <AuthRoute user={user}>
                <Login setUser={setUser} setToken={setToken} setUserId={setUserId} />
              </AuthRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthRoute user={user}>
                <Register setUser={setUser} setToken={setToken} setUserId={setUserId} />
              </AuthRoute>
            } 
          />
          
          {/* Ruta del detalle del post - pública pero con funcionalidades para usuarios logueados */}
          <Route 
            path="/post/:id" 
            element={
              <PostDetail user={user} userId={userId} token={token} />
            } 
          />
          
          {/* Rutas protegidas - solo para usuarios logueados */}
          <Route 
            path="/add-post" 
            element={
              <ProtectedRoute user={user} redirectTo="/login">
                <AddPost 
                  user={user} 
                  token={token} 
                  onPostCreated={triggerRefresh} 
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/comment/:postId" 
            element={
              <ProtectedRoute user={user} redirectTo="/login">
                <CommentForm user={user} token={token} />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta catch-all para 404 */}
          <Route 
            path="*" 
            element={
              <div className="page-container">
                <div className="error-container">
                  <div className="error-icon">🗺️</div>
                  <h2>¡Te has perdido!</h2>
                  <p>La página que buscas no existe o fue movida.</p>
                  <Navigate to="/" replace />
                </div>
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

