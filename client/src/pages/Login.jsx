import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser} from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
      const[error,setError] = useState("")
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
        setError("")
        try { 
          const data = await loginUser(formData);
          login(data);
          navigate("/chat");
        } catch (error) {
          const backendErrorMessage = error.response?.data?.message  || error.message || "Login failed. Please try again.";
          setError(backendErrorMessage) 
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
        {error && (
        <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
          {error}
        </div>
      )}
      </form>

    </div>

  );
};

export default Login;