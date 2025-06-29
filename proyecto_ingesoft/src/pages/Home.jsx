import { Link } from 'react-router-dom'
import TourCard from '../components/TourCard.jsx'
export const dummyPosts = [
  {
    id: 1,
    title: "Cascada Azul",
    description: "Una hermosa cascada en las montañas...",
    image: "https://picsum.photos/600/400",
    rating: 4.7
  },
  {
    id: 2,
    title: "Tour por Cartagena",
    description: "Descubre la ciudad amurallada...",
    image: "https://picsum.photos/600/400?random=1",
    rating: 4.3
  }
  ,
  {
    id: 3,
    title: "Parque Tayrona",
    description: "Un paraíso natural en la costa caribeña...",
    image: "https://picsum.photos/600/400?random=2",
    rating: 4.8
  },
  {
    id: 4,
    title: "Islas del Rosario",
    description: "Un archipiélago de ensueño cerca de Cartagena...",
    image: "https://picsum.photos/600/400?random=3",
    rating: 4.5
  }
  ,
  {
    id: 5,
    title: "Ciudad Perdida",
    description: "Una antigua ciudad indígena en la Sierra Nevada...",
    image: "https://picsum.photos/600/400?random=4",
    rating: 4.9
  }
  ,
  {
    id: 6,
    title: "Parque Nacional Natural Los Nevados",
    description: "Un parque con paisajes de montaña impresionantes...",
    image: "https://picsum.photos/600/400?random=5",
    rating: 4.6
  }
  ,
  {
    id: 7,
    title: "Santuario de Fauna y Flora Malpelo",
    description: "Un lugar ideal para el buceo y la observación de tiburones...",
    image: "https://picsum.photos/600/400?random=6",
    rating: 4.4
  }
  ,
  {
    id: 8,
    title: "Reserva Natural El Paujil",
    description: "Un refugio para aves y fauna silvestre en el Amazonas...",
    image: "https://picsum.photos/600/400?random=7",
    rating: 4.2
  }
  ,
  {
    id: 9,
    title: "Parque Arví",
    description: "Un parque ecológico en las montañas de Medellín...",
    image: "https://picsum.photos/600/400?random=8",
    rating: 4.1
  }
  ,
  {
    id: 10,
    title: "Laguna de Guatavita",
    description: "Un lugar sagrado para los indígenas muiscas...",
    image: "https://picsum.photos/600/400?random=9",
    rating: 4.0
  }
    ,
  {
    id: 11,
    title: "Parque Nacional Natural Tayrona",
    description: "Un parque con playas paradisíacas y biodiversidad única...",
    image: "https://picsum.photos/600/400?random=10",
    rating: 4.8
  }
  
]
export default function Home() {
  return (
    <div className="posts">
      {dummyPosts.map(post => (
        <TourCard key={post.id} post={post} />
      ))}
    </div>
  )
}