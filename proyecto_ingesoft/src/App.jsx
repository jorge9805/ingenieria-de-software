import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostDetail from './pages/PostDetail'
import AddPost from './pages/AddPost'
import CommentForm from './pages/CommentForm'
import { useState } from 'react'

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<PostDetail user={user} />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/comment/:postId" element={<CommentForm />} />
      </Routes>
    </>
  )
}
