import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json(); // backend response

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);

        navigate("/"); // redirect
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  // Fixed positions for floating icons
  const icons = ["🎬", "🎥", "🎤", "🍿"];
  const iconPositions = [
    { top: "10%", left: "5%" },
    { top: "25%", left: "80%" },
    { top: "60%", left: "20%" },
    { top: "75%", left: "70%" },
  ];

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-br from-black via-red-950 to-black text-white overflow-hidden">
      {/* Floating icons */}
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

      {/* Login Form */}
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
          <a href="/signup" className="text-yellow-400 hover:underline">
            Sign Up
          </a>
        </p>
      </form>

      {/* Floating animation */}
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
