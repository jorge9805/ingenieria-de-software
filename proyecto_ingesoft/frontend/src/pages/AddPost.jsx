import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddPost({ user, token, onPostCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Redirigir si no está logueado
  useEffect(() => {
    if (!user || !token) {
      navigate('/')
    }
  }, [user, token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Verificar que el usuario esté logueado
    if (!user || !token) {
      setError('Debes estar logueado para crear un post')
      navigate('/login')
      return
    }

    // Debug: verificar token
    console.log('Token:', token)
    console.log('User:', user)

    try {
      const res = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, image_url: image })
      })

      const data = await res.json()
    
      if (res.ok) {
        onPostCreated() // Trigger refresh in Home
        navigate('/')
      } else {
        setError(data.error || 'Error al crear el post')
      }
    } catch (err) {
      console.error(err)
      setError('Error al conectar con el servidor')
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Nuevo Post</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        type="text"
        placeholder="Nombre del lugar"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Descripción completa..."
        rows={5}
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      ></textarea>
      <input
        type="url"
        placeholder="URL de la imagen"
        value={image}
        onChange={e => setImage(e.target.value)}
        required
      />
      <button type="submit">Publicar</button>
    </form>
  )
}
