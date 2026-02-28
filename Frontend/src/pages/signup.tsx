import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/editprofile");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const iconStyles = [
    { top: "10%", left: "5%" },
    { top: "30%", left: "80%" },
    { top: "60%", left: "20%" },
    { top: "75%", left: "70%" },
  ];

  const icons = ["🎬", "🎥", "🎤", "🍿"];

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-br from-black via-red-950 to-black text-white overflow-hidden">
      {/* Floating Logo */}
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
            top: iconStyles[idx].top,
            left: iconStyles[idx].left,
            animationDelay: `${idx * 1}s`,
          }}
        >
          {icon}
        </span>
      ))}

      <form
        className="relative z-10 w-full max-w-md rounded-2xl bg-gray-800/70 p-8 shadow-xl backdrop-blur-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-yellow-400">
          FilmJunc Signup
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

        <label className="block mb-4">
          <span className="text-gray-300">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
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
          Create Account
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </form>

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

export default Signup;
