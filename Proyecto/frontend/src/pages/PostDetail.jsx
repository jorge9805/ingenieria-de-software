// pages/PostDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import TourCard from '../components/TourCard'
import ConfirmModal from '../components/ConfirmModal'
import { Star } from 'lucide-react'

export default function PostDetail({ user, userId, token }) {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [editRating, setEditRating] = useState(5)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [showDeletePostModal, setShowDeletePostModal] = useState(false)
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

  // Función para iniciar la edición de un comentario
  const handleEditComment = (comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
    setEditRating(comment.rating)
  }

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent('')
    setEditRating(5)
  }

  // Función para guardar cambios en un comentario
  const handleSaveComment = async (commentId) => {
    if (!editContent.trim()) {
      alert('El comentario no puede estar vacío')
      return
    }

    setIsUpdating(true)
    try {
      const res = await fetch(`http://localhost:4000/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: editContent.trim(), 
          rating: editRating 
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'No se pudo actualizar el comentario')
      }

      // Recargar el post para mostrar el comentario actualizado
      const updatedPost = await fetch(`http://localhost:4000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (updatedPost.ok) {
        const data = await updatedPost.json()
        setPost(data)
        
        // Mostrar mensaje de éxito
        const notification = document.createElement('div')
        notification.textContent = '✅ Comentario actualizado correctamente'
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #51cf66;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          font-weight: 600;
        `
        document.body.appendChild(notification)
        setTimeout(() => notification.remove(), 3000)
      }

      // Limpiar estado de edición
      handleCancelEdit()
    } catch (err) {
      console.error('Error actualizando comentario:', err)
      alert(`Error: ${err.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  // Función para mostrar modal de confirmación de eliminación
  const handleDeleteComment = (commentId) => {
    setCommentToDelete(commentId)
    setShowDeleteModal(true)
  }

  // Función para confirmar eliminación de comentario
  const handleConfirmDeleteComment = async () => {
    if (!commentToDelete) return

    try {
      const res = await fetch(`http://localhost:4000/api/comments/${commentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'No se pudo eliminar el comentario')
      }

      // Recargar el post para mostrar los comentarios actualizados
      const updatedPost = await fetch(`http://localhost:4000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (updatedPost.ok) {
        const data = await updatedPost.json()
        setPost(data)
        
        // Mostrar mensaje de éxito
        const notification = document.createElement('div')
        notification.textContent = '✅ Comentario eliminado correctamente'
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #51cf66;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          font-weight: 600;
        `
        document.body.appendChild(notification)
        setTimeout(() => notification.remove(), 3000)
      }
    } catch (err) {
      console.error('Error eliminando comentario:', err)
      alert(`Error: ${err.message}`)
    } finally {
      setShowDeleteModal(false)
      setCommentToDelete(null)
    }
  }

  // Función para cancelar eliminación de comentario
  const handleCancelDeleteComment = () => {
    setShowDeleteModal(false)
    setCommentToDelete(null)
  }

  // Funciones para eliminar post
  const handleDeletePost = () => {
    setShowDeletePostModal(true)
  }

  const handleConfirmDeletePost = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        // Mostrar mensaje de éxito y redirigir
        const notification = document.createElement('div')
        notification.textContent = '🗑️ Post eliminado correctamente'
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ff6b6b;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          font-weight: 600;
        `
        document.body.appendChild(notification)
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          notification.remove()
          navigate('/?filter=myposts')
        }, 2000)
      } else {
        throw new Error('No se pudo eliminar el post')
      }
    } catch (error) {
      console.error('Error eliminando post:', error)
      alert('Error al eliminar el post')
    } finally {
      setShowDeletePostModal(false)
    }
  }

  const handleCancelDeletePost = () => {
    setShowDeletePostModal(false)
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

  // Función para renderizar estrellas editables
  const renderEditableStars = () => {
    return (
      <div className="star-rating edit-mode">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1
          const isActive = starValue <= editRating
          
          return (
            <button
              key={starValue}
              type="button"
              className={`star-button ${isActive ? 'active' : ''}`}
              onClick={() => setEditRating(starValue)}
            >
              <Star 
                size={20} 
                fill={isActive ? '#ffd43b' : 'none'}
                color={isActive ? '#ffd43b' : '#e2e8f0'}
                className="star-icon"
              />
            </button>
          )
        })}
        <span className="rating-text edit">
          {editRating} de 5 estrella{editRating !== 1 ? 's' : ''}
        </span>
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
            userId={userId}
            token={token} 
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeletePost}
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
              <Link to={`/comment/${post.id}`} className="btn btn-primary">
                Añadir comentario
              </Link>
            )}
          </div>

          {post.comments && post.comments.length > 0 ? (
            <div className="comments-list">
              {post.comments.map((comment, index) => (
                <div key={comment.id || index} className="comment-card">
                  {editingComment === comment.id ? (
                    // Modo edición
                    <div className="comment-edit-form">
                      <div className="comment-header edit">
                        <span className="comment-author">{comment.user_name}</span>
                        <span className="comment-date">
                          {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Fecha no disponible'}
                        </span>
                      </div>
                      
                      <div className="edit-content">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="edit-textarea"
                          placeholder="Escribe tu comentario..."
                          rows="4"
                        />
                        
                        <div className="edit-rating">
                          <label>Calificación:</label>
                          {renderEditableStars()}
                        </div>
                      </div>
                      
                      <div className="edit-actions">
                        <button 
                          onClick={() => handleSaveComment(comment.id)}
                          className="btn btn-primary btn-sm"
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="btn btn-secondary btn-sm"
                          disabled={isUpdating}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <div className="comment-view">
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
                      
                      {/* Mostrar botones de edición/eliminación solo al autor del comentario */}
                      {user && String(comment.user_id) === String(userId) && (
                        <div className="comment-actions">
                          <button 
                            onClick={() => handleEditComment(comment)}
                            className="btn btn-secondary btn-sm"
                          >
                            ✏️ Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="btn btn-danger btn-sm"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-comments">
              <div className="empty-icon">💭</div>
              <h4>Aún no hay comentarios</h4>
              <p>¡Sé el primero en compartir tu opinión sobre este destino!</p>
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

      {/* Modal de confirmación para eliminar comentario */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDeleteComment}
        onClose={handleCancelDeleteComment}
        title="Eliminar comentario"
        message="¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Modal de confirmación para eliminar post */}
      <ConfirmModal
        isOpen={showDeletePostModal}
        onConfirm={handleConfirmDeletePost}
        onClose={handleCancelDeletePost}
        title="Eliminar post"
        message="¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer y se eliminarán también todos los comentarios asociados."
        confirmText="Eliminar Post"
        cancelText="Cancelar"
      />
    </div>
  )
}
