import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/authService'
function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFromData] = useState({
    username: "",
    email: "",
    password: ""
  })
  const handleChange = (e) => {
    setFromData({
      ...formData,
      [e.target.value]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await registerUser(formData)
      login(data)
      navigate("/chat")

    } catch (error) {
      console.log(error)

    }
  }
  
  return (

    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="border p-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2"
        />

        <button
          className="bg-black text-white p-2"
        >
          Register
        </button>

      </form>

    </div>

  )
}

export default Register     