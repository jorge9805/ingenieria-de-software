import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login({ setUser }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setUser(email)
    navigate('/')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
      <p><a href="#">¿Olvidaste tu contraseña?</a></p>
    </form>
  )
}