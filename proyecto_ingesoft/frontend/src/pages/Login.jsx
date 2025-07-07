import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

export default function Login({ setUser, setToken }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        setUser(data.name)
        setToken(data.token)
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.name)
        setError(null)
        navigate('/')
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch (err) {
      console.error(err)
      setError('No se pudo conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">
            🌟
          </div>
          <h1>¡Bienvenido de vuelta!</h1>
          <p>Inicia sesión para descubrir destinos increíbles</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
          
          <div className="auth-footer">
            <p>¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate aquí</Link></p>
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
    </div>
  )
}
