import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'

function App() {
  return (
   <Routes>
    <Route path='/' element={<Landing />} />
    <Route path='/login' element={<Login />} />
    <Route path ="/register" element={<Register />} />
    <Route path ="/chat" element={
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    } />
   </Routes>
  )
}

export default App