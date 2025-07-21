import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

// Importar el logo desde assets
import ospreyLogo from '../assets/osprey-logo.png'

export default function Navbar({ user, setUser, setToken, onLogout, currentPath }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const handleLogout = () => {
    setShowUserMenu(false) // Cerrar el menú
    if (onLogout) {
      onLogout()
    } else {
      // Fallback al método anterior
      setUser(null)
      setToken(null)
      localStorage.clear()
    }
    navigate('/') // Redirigir al home
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' && !location.search
    }
    if (path.includes('filter=all')) {
      // "🌍 Explorar" está activo cuando no hay filtro o cuando filter=all
      return location.pathname === '/' && (!location.search || location.search.includes('filter=all'))
    }
    if (path.includes('filter=')) {
      return location.search.includes(path.split('?')[1])
    }
    return location.pathname === path
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={ospreyLogo} alt="OSPREY" className="logo-img" />
      </Link>
      
      <div className="actions">
        <Link 
          to="/" 
          className={isActive('/?filter=all') ? 'active' : ''}
        >
          🌍 Explorar
        </Link>
        {user && (
          <>
            <Link 
              to="/?filter=favorites" 
              className={isActive('/?filter=favorites') ? 'active' : ''}
            >
              ❤️ Favoritos
            </Link>
            <Link 
              to="/?filter=myposts" 
              className={isActive('/?filter=myposts') ? 'active' : ''}
            >
              📝 Mis Posts/Comentarios
            </Link>
            <Link 
              to="/add-post" 
              className={`add-post-btn ${isActive('/add-post') ? 'active' : ''}`}
            >
              ➕ Nuevo Post
            </Link>
          </>
        )}
      </div>

      <div className="auth">
        {user ? (
          <div className="user-menu-container" ref={userMenuRef}>
            <button 
              className="user-badge" 
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              👋 {user} ▼
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <Link 
                  to="/settings" 
                  className="dropdown-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  ⚙️ Configuraciones
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="dropdown-item logout-item"
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`auth-link login ${isActive('/login') ? 'active' : ''}`}
            >
              🔑 Login
            </Link>
            <Link 
              to="/register" 
              className={`auth-link register ${isActive('/register') ? 'active' : ''}`}
            >
              📝 Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}