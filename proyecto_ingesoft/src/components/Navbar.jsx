import { Link } from 'react-router-dom'
export default function Navbar({ user, setUser }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">🌎 TurismoApp</Link>
      <input type="text" placeholder="Buscar..." className="search" />
      <div className="actions">
        {user ? (
          <>
            <span>Bienvenido, {user}</span>
            <Link to="/add-post">Post</Link>
            <button onClick={() => setUser(null)}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}