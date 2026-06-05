import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  loginUser,
} from "../services/authService";

import { useAuth } from "../context/AuthContext";


const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data =
      await loginUser(formData);
      login(data);
      navigate("/chat");
    } catch (error) {
      console.log(error);
    }
  };


  return (

    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >
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
          Login
        </button>
      </form>

    </div>

  );
};

export default Login;