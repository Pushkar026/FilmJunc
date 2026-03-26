import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("✅ Login successful! Redirecting...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          if (!data.user.profileCompleted) {
            navigate("/editprofile");
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        setErrors({ submit: data.message || "Login failed" });
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const icons = ["🎬", "🎥", "🎤", "🍿"];
  const iconPositions = [
    { top: "10%", left: "5%" },
    { top: "25%", left: "80%" },
    { top: "60%", left: "20%" },
    { top: "75%", left: "70%" },
  ];

  return (
    <div className="relative flex flex-col h-screen bg-gradient-to-br from-black via-red-950 to-black text-white overflow-hidden">
      {/* Floating Logo (Using Link) */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="text-2xl font-extrabold text-yellow-400 hover:text-yellow-300 hover:scale-105 transition duration-300"
        >
          🎬 FilmJunc
        </Link>
      </div>

      {/* Floating Background Icons */}
      {icons.map((icon, idx) => (
        <span
          key={idx}
          className="absolute text-5xl opacity-70 animate-float"
          style={{
            top: iconPositions[idx].top,
            left: iconPositions[idx].left,
            animationDelay: `${idx * 1}s`,
          }}
        >
          {icon}
        </span>
      ))}

      {/* Center Form */}
      <div className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-md rounded-2xl bg-gray-800/70 p-8 shadow-xl backdrop-blur-lg"
        >
          <h2 className="mb-6 text-center text-3xl font-bold text-yellow-400">
            FilmJunc Login
          </h2>

          {/* Error Alert */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-300 text-sm">
              {successMsg}
            </div>
          )}

          <label className="block mb-4">
            <span className="text-gray-300 text-sm font-semibold">
              Username
            </span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-xl border-2 bg-gray-900 px-4 py-3 text-white focus:outline-none transition ${
                errors.username
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-700 focus:border-yellow-400"
              }`}
              placeholder="Enter username"
              disabled={loading}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </label>

          <label className="block mb-6">
            <span className="text-gray-300 text-sm font-semibold">
              Password
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-xl border-2 bg-gray-900 px-4 py-3 text-white focus:outline-none transition ${
                errors.password
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-700 focus:border-yellow-400"
              }`}
              placeholder="Enter password"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl px-4 py-3 font-semibold transition ${
              loading
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95"
            }`}
          >
            {loading ? "⏳ Logging in..." : "🎬 Login"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-400 hover:underline font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </form>
      </div>

      <style>
        {`
          @keyframes float { 
            0%, 100% { transform: translateY(0) rotate(0deg); } 
            50% { transform: translateY(-20px) rotate(15deg); } 
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
};

export default Login;
