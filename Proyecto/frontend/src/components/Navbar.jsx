import { Link, useNavigate, useLocation } from 'react-router-dom'

// Importar el logo desde assets
import ospreyLogo from '../assets/osprey-logo.png'

export default function Navbar({ user, setUser, setToken, onLogout, currentPath }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleLogout = () => {
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
          to="/?filter=all" 
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
              📝 Mis Posts
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
          <>
            <span className="user-badge">👋 {user}</span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Cerrar sesión
            </button>
          </>
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