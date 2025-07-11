import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Heart, Trash2, Calendar, MapPin, User } from 'lucide-react'

export default function TourCard({ post, user, token, onToggleFavorite, onDelete, isDetailView = false }) {
  const [fav, setFav] = useState(post.is_favorite)
  
  // Actualizar estado local cuando cambie el prop
  useEffect(() => {
    setFav(post.is_favorite)
  }, [post.is_favorite])
  
  const handleFav = async () => {
    if (!user) return
    
    // Cambio inmediato sin loading
    const newFavState = !fav
    setFav(newFavState)
    
    try {
      await onToggleFavorite(post.id, newFavState)
    } catch (error) {
      console.error('Error al cambiar favorito:', error)
      // Revertir si hay error
      setFav(!newFavState)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const imageElement = isDetailView ? (
    <div className="post-image-container detail">
      <img src={post.image_url} alt={post.title} className="post-image detail" />
      <div className="image-overlay">
        <div className="image-gradient"></div>
        <div className="image-meta">
          {post.created_at && (
            <div className="meta-item">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
          )}
          {post.location && (
            <div className="meta-item">
              <MapPin size={16} />
              <span>{post.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Link to={`/post/${post.id}`} className="image-link">
      <img src={post.image_url} alt={post.title} className="post-image" />
    </Link>
  )

  return (
    <div className={`post-card ${isDetailView ? 'detail-view' : ''}`}>
      {imageElement}
      
      <div className="card-content">
        <div className="card-header">
          {isDetailView ? (
            <h1 className="card-title detail">{post.title}</h1>
          ) : (
            <h3 className="card-title">
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </h3>
          )}
          
          {post.user_name && (
            <div className="card-author">
              <User size={14} />
              <span>Por {post.user_name}</span>
            </div>
          )}
        </div>

        {!isDetailView && (
          <p className="card-description">{post.description}</p>
        )}
        
        <div className="card-footer">
          <div className="card-rating">
            <span className="rating-star">⭐</span>
            <span className="rating-value">{post.average_rating || '0'}</span>
            <span className="rating-text">
              ({post.average_rating ? 'Calificado' : 'Sin calificar'})
            </span>
          </div>
          
          <div className="card-actions">
            <div className="action-left">
              {user && (
                <button 
                  className={`action-button heart-button ${fav ? 'favorito' : ''}`}
                  onClick={handleFav}
                  title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart 
                    className={`heart ${fav ? 'favorito' : ''}`}
                    size={20}
                    fill={fav ? 'currentColor' : 'none'}
                  />
                </button>
              )}
            </div>
            <div className="action-right">
              {user === post.user_name && (
                <button 
                  className="action-button delete-button"
                  onClick={() => onDelete(post.id)}
                  title="Eliminar post"
                >
                  <Trash2 className="trash" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
