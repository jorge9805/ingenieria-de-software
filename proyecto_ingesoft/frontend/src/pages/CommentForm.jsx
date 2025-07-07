import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Star, Send } from 'lucide-react'

export default function CommentForm({ user, token }) {
  const { postId } = useParams()
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment_text, setCommentText] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [post, setPost] = useState(null)
  const navigate = useNavigate()

  // Redirigir si no está logueado
  useEffect(() => {
    if (!user || !token) {
      navigate('/')
    }
  }, [user, token, navigate])

  // Cargar información del post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setPost(data)
        }
      } catch (err) {
        console.error('Error al cargar post:', err)
      }
    }

    if (postId && token) {
      fetchPost()
    }
  }, [postId, token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!comment_text.trim()) {
      setError('Por favor escribe un comentario')
      return
    }
    
    if (!token) {
      setError('Debes estar logueado para comentar')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:4000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId, comment_text: comment_text.trim(), rating })
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('Error del servidor:', text)
        setError(`Error ${res.status}: ${text}`)
        return
      }

      const data = await res.json()
      navigate(`/post/${postId}`)

    } catch (err) {
      console.error('Error de red:', err)
      setError('Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isActive = starValue <= (hoverRating || rating)
      
      return (
        <button
          key={starValue}
          type="button"
          className={`star-button ${isActive ? 'active' : ''}`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={isLoading}
        >
          <Star 
            size={24} 
            fill={isActive ? 'currentColor' : 'none'}
            className="star-icon"
          />
        </button>
      )
    })
  }

  return (
    <div className="page-container">
      <div className="comment-form-container">
        {/* Header con navegación */}
        <div className="comment-form-header">
          <Link to={`/post/${postId}`} className="back-button">
            <ArrowLeft size={20} />
            Volver al post
          </Link>
          
          {post && (
            <div className="post-preview">
              <img src={post.image_url} alt={post.title} className="post-thumbnail" />
              <div className="post-info">
                <h3>{post.title}</h3>
                <p>por {post.user_name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Formulario */}
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h1>💬 Agregar Comentario</h1>
            <p>Comparte tu experiencia y ayuda a otros viajeros</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Rating con estrellas */}
          <div className="form-group">
            <label>⭐ Calificación</label>
            <div className="star-rating">
              {renderStars()}
              <span className="rating-text">
                {rating} de 5 estrella{rating !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="field-hint">
              Califica tu experiencia con este destino
            </p>
          </div>

          {/* Comentario */}
          <div className="form-group">
            <label htmlFor="comment">📝 Tu comentario</label>
            <textarea
              id="comment"
              placeholder="Cuéntanos sobre tu experiencia, qué te gustó más, consejos para otros viajeros..."
              value={comment_text}
              onChange={e => setCommentText(e.target.value)}
              rows={6}
              disabled={isLoading}
              maxLength={1000}
            />
            <div className="char-counter">
              {comment_text.length}/1000 caracteres
            </div>
            <p className="field-hint">
              Sé específico y constructivo en tu comentario
            </p>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <Link 
              to={`/post/${postId}`} 
              className="btn btn-secondary"
            >
              Cancelar
            </Link>
            <button 
              type="submit" 
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !comment_text.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Publicar comentario
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
