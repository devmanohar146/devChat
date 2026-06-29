import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, MessageCircle, ArrowRight } from "lucide-react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { COLORS, FONT_DISPLAY, FONT_BODY } from "../utils/constants";

const Login = () => {
  const [error, setError] = useState("");
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
    setError("");
    try {
      const data = await loginUser(formData);
      login(data);
      navigate("/chat");
    } catch (error) {
      const backendErrorMessage =
        error.response?.data?.message || error.message || "Login failed. Please try again.";
      setError(backendErrorMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: COLORS.bg, fontFamily: FONT_BODY }}
    >
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 36,
              height: 36,
              background: `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.coral})`,
            }}
          >
            <MessageCircle size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: COLORS.ink, fontFamily: FONT_DISPLAY }}
          >
            DevChat
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-3xl p-8 shadow-sm"
          style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}
        >
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: COLORS.ink, fontFamily: FONT_DISPLAY }}
            >
              Welcome back
            </h1>
            <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>
              Log in to jump back into your DevChat.
            </p>
          </div>

          {error && (
            <div
              className="text-sm rounded-xl px-4 py-3"
              style={{ color: "#C23B2A", background: "#FFEDE9", border: "1px solid #FFD4CC" }}
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: COLORS.inkSoft }}>
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                style={{ color: "#9A93B5" }}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="email"
                name="email"
                placeholder="manu@example.com"
                onChange={handleChange}
                value={formData.email}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.indigo)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.line)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: COLORS.inkSoft }}>
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                style={{ color: "#9A93B5" }}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                value={formData.password}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.indigo)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.line)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 font-semibold text-sm rounded-full py-3 mt-1 transition-opacity hover:opacity-90"
            style={{ background: COLORS.indigo, color: "#fff" }}
          >
            Log in
            <ArrowRight size={16} />
          </button>

          <p className="text-xs text-center" style={{ color: COLORS.inkSoft }}>
            New here?{" "}
            <Link to="/register" style={{ color: COLORS.indigo, fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;