// pages/PostDetail.jsx
import TourCard from '../components/TourCard'
import { useParams, useNavigate } from 'react-router-dom'
import { dummyPosts } from './Home'

export default function PostDetail({ user }) {
  const { id } = useParams()
  const post = dummyPosts.find(p => p.id === parseInt(id)) || {}
  const navigate = useNavigate()

  return (
    <div className="post-detail">
      <TourCard post={post} />
      <p>{post.description}</p>
      <h3>Comentarios</h3>
      <ul>
        {(post.comments || []).map((c, i) => <li key={i}><strong>{c.user}</strong>: {c.text}</li>)}
      </ul>
      {user ? (
        <>
          <button>Añadir a Favoritos</button>
          <button onClick={() => navigate(`/comment/${post.id}`)}>Comentar</button>
        </>
      ) : <p>Inicia sesión para comentar o guardar.</p>}
    </div>
  )
}