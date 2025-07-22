import { useEffect, useState } from 'react'
import TourCard from '../components/TourCard'
import ConfirmModal from '../components/ConfirmModal'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { fetchWithAuth, checkServerHealth, showNotification } from '../utils/api'

export default function Home({ user, userId, token, refreshPosts }) {
  const [posts, setPosts] = useState([])
  const [myComments, setMyComments] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')

  const fetchPosts = async (search = '') => {
    try {
      let url = 'http://localhost:4000/api/posts'
      
      // Si hay búsqueda y estamos en la pestaña de explorar, usar ruta específica de búsqueda
      if (search && search.trim() && filter !== 'favorites' && filter !== 'myposts') {
        url = `http://localhost:4000/api/posts/search?q=${encodeURIComponent(search.trim())}`
      } else {
        // Sin búsqueda o en otras pestañas, aplicar filtros normales
        if (filter === 'favorites') url = 'http://localhost:4000/api/favorites'
        if (filter === 'myposts') url = 'http://localhost:4000/api/posts/my'
      }
      
      // Para favoritos y mis posts, requerir token
      if ((filter === 'favorites' || filter === 'myposts') && !token) {
        setPosts([])
        setIsInitialLoad(false)
        return
      }
      
      const res = await fetchWithAuth(url, token)
      const data = await res.json()
      setPosts(data)
      setIsInitialLoad(false)
    } catch (error) {
      console.error('Error fetching posts:', error.message)
      setPosts([])
      setIsInitialLoad(false)
      
      // Verificar conectividad del servidor
      const serverUp = await checkServerHealth()
      if (!serverUp) {
        console.error('Backend server appears to be down. Please ensure it\'s running on http://localhost:4000')
        showNotification('❌ No se puede conectar con el servidor. Verifica que esté ejecutándose.', 'error')
      } else {
        showNotification('❌ Error cargando posts. Reintentando...', 'error')
      }
    }
  }

  const fetchMyComments = async () => {
    if (!token) {
      setMyComments([])
      return
    }
    
    try {
      const res = await fetchWithAuth('http://localhost:4000/api/comments/my', token)
      const data = await res.json()
      setMyComments(data)
    } catch (error) {
      console.error('Error fetching my comments:', error.message)
      setMyComments([])
      showNotification('❌ Error cargando comentarios', 'error')
    }
  }

  useEffect(() => { 
    // Marcar como carga inicial
    setIsInitialLoad(true)
    
    // Limpiar búsqueda cuando no esté en la pestaña de explorar
    if (filter === 'favorites' || filter === 'myposts') {
      setSearchTerm('')
    }
    
    // Usar la función fetchPosts mejorada
    fetchPosts('')
    
    // Solo buscar comentarios cuando estemos en la pestaña correcta
    if (filter === 'myposts' && token) {
      fetchMyComments()
    }
  }, [filter, token, refreshPosts])

  // Buscar cuando el usuario deje de escribir por 500ms - Solo en pestaña de explorar
  useEffect(() => {
    // Solo ejecutar búsqueda si estamos en la pestaña de explorar
    if (filter === 'favorites' || filter === 'myposts') return
    
    const delayedSearch = setTimeout(() => {
      fetchPosts(searchTerm)
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm, filter])

  const handleClearSearch = () => {
    setSearchTerm('')
    fetchPosts('')
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion)
    fetchPosts(suggestion)
  }

  const searchSuggestions = [
    'playa', 'montaña', 'aventura', 'cultura', 'historia', 
    'tropical', 'templos', 'relax', 'trekking', 'buceo'
  ]

  const toggleFav = async (postId, add) => {
    try {
      const method = add ? 'POST' : 'DELETE'
      await fetchWithAuth(`http://localhost:4000/api/favorites`, token, {
        method,
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ postId })
      })
      
      // Solo pasar searchTerm si estamos en la pestaña de explorar
      fetchPosts((filter === 'favorites' || filter === 'myposts') ? '' : searchTerm)
    } catch (error) {
      console.error('Error toggling favorite:', error.message)
      showNotification('❌ Error al cambiar favorito', 'error')
    }
  }

  const deletePost = (postId) => {
    setPostToDelete(postId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!postToDelete) return

    try {
      await fetchWithAuth(`http://localhost:4000/api/posts/${postToDelete}`, token, {
        method: 'DELETE'
      })
      
      // Solo pasar searchTerm si estamos en la pestaña de explorar
      fetchPosts((filter === 'favorites' || filter === 'myposts') ? '' : searchTerm)
      
      showNotification('🗑️ Post eliminado correctamente', 'success')
    } catch (error) {
      console.error('Error deleting post:', error.message)
      showNotification('❌ Error al eliminar el post', 'error')
    } finally {
      setShowDeleteModal(false)
      setPostToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setPostToDelete(null)
  }

  return (
    <div className="main-container">
      {/* Banner de exploración - Solo para usuarios no logueados */}
      {!user && (
        <div className="guest-banner">
          <div className="banner-content">
            <h1>🌍 Explora el Mundo Sin Límites</h1>
            <p>Descubre 3 destinos increíbles. ¡Únete para guardar favoritos, comentar y compartir tus propias aventuras!</p>
            
            <div className="features-grid">
              <div className="feature">
                <span className="feature-icon">💙</span>
                <span>Guarda favoritos</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💬</span>
                <span>Deja comentarios</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📸</span>
                <span>Comparte destinos</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <span>Califica experiencias</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda - Solo visible en la pestaña de explorar */}
      {(filter !== 'favorites' && filter !== 'myposts') && (
        <div className="search-container">
          <div className="search-box">
            <Search size={22} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar destinos por nombre, descripción o experiencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={handleClearSearch}
                className="clear-search-btn"
                title="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {!searchTerm && (
            <div className="search-suggestions">
              <div className="suggestion-title">💡 Búsquedas populares</div>
              <div className="suggestions">
                {searchSuggestions.map((suggestion) => (
                  <span
                    key={suggestion}
                    className="suggestion-tag"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contenido principal */}
      {!isInitialLoad && posts.length === 0 ? (
        <div className={`empty-state ${filter === 'favorites' ? 'favorites-empty' : ''}`}>
          <div className="empty-icon">
            {searchTerm ? '🔍' : filter === 'favorites' ? '❤️' : filter === 'myposts' ? '📝' : '🌎'}
          </div>
          <h3>
            {searchTerm 
              ? 'No se encontraron destinos'
              : filter === 'favorites' 
              ? 'Aún no tienes favoritos' 
              : filter === 'myposts' 
              ? 'No has creado posts aún'
              : 'No hay destinos disponibles'
            }
          </h3>
          <p>
            {searchTerm 
              ? `No encontramos destinos que coincidan con "${searchTerm}". Prueba términos como "playa", "montaña", "aventura" o "cultura".`
              : filter === 'favorites' 
              ? 'Explora destinos y marca tus favoritos con el corazón ❤️' 
              : filter === 'myposts' 
              ? '¡Comparte tu primer destino turístico!'
              : 'Sé el primero en compartir un destino increíble'
            }
          </p>
          {searchTerm && (
            <div className="empty-actions">
              <button 
                className="btn btn-primary"
                onClick={handleClearSearch}
              >
                <X size={18} />
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      ) : !isInitialLoad && posts.length > 0 ? (
        <>
          <div className={`page-header ${filter === 'favorites' ? 'favorites-header' : ''}`}>
            <h1>
              {filter === 'favorites' 
                ? '❤️ Tus Destinos Favoritos' 
                : filter === 'myposts' 
                ? '📝 Mis Publicaciones'
                : user ? '🌍 Descubre Destinos Increíbles'
                : '🌍 Explora el Mundo Sin Límites'
              }
            </h1>
            <p>
              {filter === 'favorites' 
                ? `${posts.length} destinos que amas` 
                : filter === 'myposts' 
                ? `${posts.length} destinos compartidos`
                : user ? `${posts.length} destinos esperándote`
                : `Descubre ${posts.length} destinos increíbles`
              }
            </p>
          </div>
          <div className="posts">
            {posts.map(post => (
              <TourCard
                key={post.id}
                post={post}
                user={user}
                userId={userId}
                token={token}
                onToggleFavorite={toggleFav}
                onDelete={filter === 'myposts' ? deletePost : null}
                currentFilter={filter}
                showDeleteButton={filter === 'myposts'}
              />
            ))}
          </div>
        </>
      ) : null}

      {/* Sección de Mis Comentarios - Solo visible en la pestaña "myposts" */}
      {filter === 'myposts' && !isInitialLoad && (
        <div className="my-comments-section">
          <div className="section-header">
            <h2>💬 Mis Comentarios</h2>
            <p>
              {myComments.length === 0 
                ? 'No has comentado en ningún destino aún'
                : `${myComments.length} comentario(s) realizados`
              }
            </p>
          </div>
          
          {myComments.length === 0 ? (
            <div className="empty-state comments">
              <div className="empty-icon">💬</div>
              <h3>No has comentado aún</h3>
              <p>Explora destinos y comparte tus experiencias y opiniones con otros viajeros</p>
            </div>
          ) : (
            <div className="comments-grid">
              {myComments.map(comment => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <div className="comment-rating">
                      <span className="rating-stars">{'⭐'.repeat(comment.rating)}</span>
                      <span className="rating-value">{comment.rating}/5</span>
                    </div>
                    <div className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="comment-content">
                    <p>"{comment.content}"</p>
                  </div>
                  
                  <div className="comment-post-info">
                    <span className="comment-post-title">
                      En: <strong>{comment.post_title}</strong>
                    </span>
                    <a 
                      href={`/post/${comment.post_id}`}
                      className="view-post-link"
                    >
                      Ver post →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmación para eliminar posts */}
      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar Post"
        message="¿Estás seguro de que quieres eliminar este post? Todos los comentarios y favoritos también se eliminarán. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
