import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (!data.user.profileCompleted) {
          navigate("/editprofile");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
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
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-md rounded-2xl bg-gray-800/70 p-8 shadow-xl backdrop-blur-lg"
        >
          <h2 className="mb-6 text-center text-3xl font-bold text-yellow-400">
            FilmJunc Login
          </h2>

          <label className="block mb-4">
            <span className="text-gray-300">Username</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-300">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            Login
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-yellow-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {/* Floating Animation */}
      <style>
        {`
          @keyframes float { 
            0%,100% { transform: translateY(0) rotate(0deg); } 
            50% { transform: translateY(-20px) rotate(15deg); } 
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
};

export default Login;
