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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("✅ Account created! Redirecting...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => navigate("/editprofile"), 1500);
      } else {
        setErrors({ submit: data.message || "Signup failed" });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
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
        className="relative z-10 w-full max-w-md rounded-2xl bg-gray-800/70 p-8 shadow-xl backdrop-blur-lg mx-4"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-yellow-400">
          FilmJunc Signup
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
          <span className="text-gray-300 text-sm font-semibold">Username</span>
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
            placeholder="Enter username (min 3 chars)"
            disabled={loading}
          />
          {errors.username && (
            <p className="text-red-400 text-xs mt-1">{errors.username}</p>
          )}
        </label>

        <label className="block mb-4">
          <span className="text-gray-300 text-sm font-semibold">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-xl border-2 bg-gray-900 px-4 py-3 text-white focus:outline-none transition ${
              errors.email
                ? "border-red-500 focus:border-red-400"
                : "border-gray-700 focus:border-yellow-400"
            }`}
            placeholder="Enter email"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </label>

        <label className="block mb-6">
          <span className="text-gray-300 text-sm font-semibold">Password</span>
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
            placeholder="Enter password (min 6 chars)"
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
          {loading ? "⏳ Creating Account..." : "✨ Create Account"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-400 hover:underline font-semibold"
          >
            Login here
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
