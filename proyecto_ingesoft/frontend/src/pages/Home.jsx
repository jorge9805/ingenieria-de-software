import { useEffect, useState } from 'react'
import TourCard from '../components/TourCard'
import { useSearchParams } from 'react-router-dom'

export default function Home({ user, token, refreshPosts }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')

  const fetchPosts = async () => {
    // Solo mostrar loading en el primer render o cambio de filtro
    if (posts.length === 0) {
      setLoading(true)
    }
    
    try {
      let url = 'http://localhost:4000/api/posts'
      if (filter === 'favorites') url = 'http://localhost:4000/api/favorites'
      if (filter === 'myposts') url = 'http://localhost:4000/api/posts/my'
      // filter === 'all' o sin filtro usa la URL base
      
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [filter, token, refreshPosts])

  const toggleFav = async (postId, add) => {
    try {
      const method = add ? 'POST' : 'DELETE'
      const res = await fetch(`http://localhost:4000/api/favorites`, {
        method,
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ postId })
      })
      if (res.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const deletePost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization:`Bearer ${token}` }
      })
      if (res.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <div className="main-container">
      {loading ? (
        <div className="loading-spinner">
          <div>🌍 Cargando destinos increíbles...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h3>
            {filter === 'favorites' 
              ? '❤️ Aún no tienes favoritos' 
              : filter === 'myposts' 
              ? '📝 No has creado posts aún'
              : '🌎 No hay destinos disponibles'
            }
          </h3>
          <p>
            {filter === 'favorites' 
              ? 'Explora destinos y marca tus favoritos con el corazón ❤️' 
              : filter === 'myposts' 
              ? '¡Comparte tu primer destino turístico!'
              : 'Sé el primero en compartir un destino increíble'
            }
          </p>
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
    </div>
  )
}
