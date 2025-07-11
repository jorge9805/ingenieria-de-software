// pages/PostDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import TourCard from '../components/TourCard'
import { Star } from 'lucide-react'

export default function PostDetail({ user, token }) {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`http://localhost:4000/api/posts/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        
        if (!res.ok) {
          throw new Error('No se pudo cargar el post')
        }
        
        const data = await res.json()
        setPost(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id, token])

  const handleToggleFavorite = (updatedPost) => {
    setPost(updatedPost)
  }

  const handleDelete = () => {
    navigate('/')
  }

  // Función para renderizar estrellas de rating
  const renderStars = (rating) => {
    if (!rating) return null
    
    return (
      <div className="comment-rating">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={14}
            fill={index < rating ? '#ffd43b' : 'none'}
            color={index < rating ? '#ffd43b' : '#e2e8f0'}
            className="rating-star"
          />
        ))}
        <span className="rating-number">({rating})</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>Cargando post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">😞</div>
          <h2>¡Oops! Algo salió mal</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">🔍</div>
          <h2>Post no encontrado</h2>
          <p>El post que buscas no existe o fue eliminado.</p>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="post-detail">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">🏠 Inicio</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Detalle del post</span>
        </nav>

        {/* Post principal */}
        <div className="post-detail-card">
          <TourCard 
            post={post} 
            user={user} 
            token={token} 
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            isDetailView={true}
          />
          
          {/* Descripción expandida */}
          {post.description && (
            <div className="post-description">
              <h3>📝 Descripción completa</h3>
              <div className="description-content">
                {post.description}
              </div>
            </div>
          )}
        </div>

        {/* Sección de comentarios */}
        <div className="comments-section">
          <div className="comments-header">
            <h3>💬 Comentarios ({post.comments?.length || 0})</h3>
            {user && (
              <Link 
                to={`/comment/${post.id}`} 
                className="btn btn-secondary btn-icon"
              >
                <span>✏️</span>
                Agregar comentario
              </Link>
            )}
          </div>

          {post.comments && post.comments.length > 0 ? (
            <div className="comments-list">
              {post.comments.map((comment, index) => (
                <div key={index} className="comment-card">
                  <div className="comment-header">
                    <div className="comment-avatar">
                      {comment.user_name?.charAt(0).toUpperCase() || '👤'}
                    </div>
                    <div className="comment-info">
                      <div className="comment-user-line">
                        <h4 className="comment-author">{comment.user_name}</h4>
                        {comment.rating && renderStars(comment.rating)}
                      </div>
                      <span className="comment-date">
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Fecha no disponible'}
                      </span>
                    </div>
                  </div>
                  <div className="comment-text">
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-comments">
              <div className="empty-icon">💭</div>
              <h4>Aún no hay comentarios</h4>
              <p>¡Sé el primero en compartir tu opinión sobre este destino!</p>
              {user && (
                <Link 
                  to={`/comment/${post.id}`} 
                  className="btn btn-primary"
                >
                  Escribir primer comentario
                </Link>
              )}
            </div>
          )}

          {!user && (
            <div className="login-prompt">
              <p>
                <Link to="/login" className="auth-link">Inicia sesión</Link> para comentar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
