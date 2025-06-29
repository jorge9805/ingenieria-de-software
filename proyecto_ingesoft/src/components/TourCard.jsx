// components/TourCard.jsx
import { Link } from 'react-router-dom'
export default function TourCard({ post }) {
  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <img src={post.image} alt={post.title} />
      <div>
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <span>⭐ {post.rating}</span>
      </div>
    </Link>
  )
}