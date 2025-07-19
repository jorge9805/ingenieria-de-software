import { useEffect, useState } from 'react'
import TourCard from '../components/TourCard'
import ConfirmModal from '../components/ConfirmModal'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'

export default function Home({ user, token, refreshPosts }) {
  const [posts, setPosts] = useState([])
  const [myComments, setMyComments] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')

  const fetchPosts = async (search = '') => {
    try {
      let url = 'http://localhost:4000/api/posts'
      
      // Si hay búsqueda, usar ruta específica de búsqueda
      if (search && search.trim()) {
        url = `http://localhost:4000/api/posts/search?q=${encodeURIComponent(search.trim())}`
      } else {
        // Sin búsqueda, aplicar filtros normales
        if (filter === 'favorites') url = 'http://localhost:4000/api/favorites'
        if (filter === 'myposts') url = 'http://localhost:4000/api/posts/my'
      }
      
      // Construir headers condicionalmente
      const headers = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
      
      const res = await fetch(url, { headers })
      
      if (!res.ok) {
        return
      }
      
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchMyComments = async () => {
    if (!token || filter !== 'myposts') return
    
    try {
      const res = await fetch('http://localhost:4000/api/comments/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        setMyComments(data)
      }
    } catch (error) {
      console.error('Error fetching my comments:', error)
    }
  }

  useEffect(() => { 
    // Solo limpiar contenido, sin loading
    setPosts([]) // Limpiar posts para evitar flash de contenido anterior
    setMyComments([]) // Limpiar comentarios
    
    // Función simple sin delays ni loading
    const fetchPostsSimple = async () => {
      try {
        let url = 'http://localhost:4000/api/posts'
        
        if (filter === 'favorites') url = 'http://localhost:4000/api/favorites'
        if (filter === 'myposts') url = 'http://localhost:4000/api/posts/my'
        
        const headers = {}
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
        
        const res = await fetch(url, { headers })
        
        if (res.ok) {
          const data = await res.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    
    fetchPostsSimple()
    fetchMyComments()
  }, [filter, token, refreshPosts])

  // Buscar cuando el usuario deje de escribir por 500ms
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchPosts(searchTerm)
      if (filter === 'myposts') {
        fetchMyComments()
      }
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
      const res = await fetch(`http://localhost:4000/api/favorites`, {
        method,
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ postId })
      })
      if (res.ok) {
        fetchPosts(searchTerm)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const deletePost = (postId) => {
    setPostToDelete(postId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!postToDelete) return

    try {
      const res = await fetch(`http://localhost:4000/api/posts/${postToDelete}`, {
        method: 'DELETE',
        headers: { Authorization:`Bearer ${token}` }
      })
      if (res.ok) {
        fetchPosts(searchTerm)
        
        // Mostrar mensaje de éxito
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
        setTimeout(() => notification.remove(), 3000)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error al eliminar el post')
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
      {/* Barra de búsqueda */}
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
        
        {searchTerm && (
          <div className={`search-info ${posts.length === 0 ? 'no-results' : ''}`}>
            {posts.length === 0 ? (
              <>
                🔍 No se encontraron destinos para "<strong>{searchTerm}</strong>"
                <br />
                <small>Intenta con otros términos como: playa, montaña, aventura, cultura...</small>
              </>
            ) : (
              <>
                ✨ Encontrados <strong>{posts.length}</strong> destino(s) para "<strong>{searchTerm}</strong>"
              </>
            )}
          </div>
        )}
        
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

      {/* Contenido principal */}
      {posts.length === 0 ? (
        <div className="empty-state">
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
      ) : (
        <>
          <div className="page-header">
            <h1>
              {filter === 'favorites' 
                ? '❤️ Tus Destinos Favoritos' 
                : filter === 'myposts' 
                ? '📝 Mis Publicaciones'
                : '🌍 Descubre Destinos Increíbles'
              }
            </h1>
            <p>
              {filter === 'favorites' 
                ? `${posts.length} destinos que amas` 
                : filter === 'myposts' 
                ? `${posts.length} destinos compartidos`
                : `${posts.length} destinos esperándote`
              }
            </p>
          </div>
          <div className="posts">
            {posts.map(post => (
              <TourCard
                key={post.id}
                post={post}
                user={user}
                token={token}
                onToggleFavorite={toggleFav}
                onDelete={deletePost}
              />
            ))}
          </div>
        </>
      )}

      {/* Sección de Mis Comentarios - Solo visible en la pestaña "myposts" */}
      {filter === 'myposts' && (
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
