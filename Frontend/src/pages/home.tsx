// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./navbar";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform a search.");
      return;
    }
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/search?location=${encodeURIComponent(
          searchTerm
        )}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Search failed: " + response.status);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleresult = () =>
    navigate(`/searchresult?location=${encodeURIComponent(searchTerm)}`);

  const icons = ["🎞️", "🎥", "🎤", "🍿"];
  const iconPositions = [
    { top: "10%", left: "5%" },
    { top: "25%", left: "80%" },
    { top: "60%", left: "20%" },
    { top: "75%", left: "70%" },
  ];

  return (
    <div className="w-full relative text-white overflow-hidden">
      {/* Show Navbar only if logged in */}
      {isLoggedIn && (
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={() => {
            handleSearch();
            handleresult();
          }}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}

      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black via-red-950 to-black">
        {/* Background Image + Spotlights + Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="\images\wp12544578-cinema-theatre-wallpapers.jpg"
            alt="Cinema background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute top-12 left-1/4 w-72 h-72 bg-yellow-400 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-red-500 rounded-full opacity-20 blur-3xl animate-pulse-slow delay-1000"></div>

          {icons.map((icon, idx) => (
            <span
              key={idx}
              className="absolute text-5xl opacity-90 animate-float"
              style={{
                top: iconPositions[idx].top,
                left: iconPositions[idx].left,
                animationDelay: `${idx * 1}s`,
              }}
            >
              {icon}
            </span>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative flex flex-col items-center justify-center h-full text-center px-4 z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 drop-shadow-[0_0_25px_rgba(255,215,0,0.8)] animate-fadeIn">
            Welcome to FilmJunc 🎬
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium max-w-md text-center animate-fadeIn delay-500">
            Connect with filmmakers, writers, editors, and creators around you.
            Build your team and bring stories to life.
          </p>

          {!isLoggedIn && (
            <div className="mt-8 flex space-x-4">
              <a
                href="/login"
                className="bg-red-700 hover:bg-red-800 px-6 py-2 rounded-xl text-white font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.9)] transition"
              >
                Login 🎟️
              </a>
              <a
                href="/signup"
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-[0_0_25px_rgba(255,255,0,0.9)] transition"
              >
                Sign Up 🏆
              </a>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="relative z-20 bg-gray-100 text-gray-900 p-10">
        <h2 className="text-3xl font-bold mb-4 text-red-700">About FilmJunc</h2>
        <p className="mb-8 text-lg leading-relaxed">
          FilmJunc is your gateway to the world of filmmaking and creativity.
          Our platform connects filmmakers, writers, editors, cinematographers,
          and other passionate creators, enabling them to collaborate, share
          ideas, and bring stories to life. Whether you're looking for your next
          project partner or want to showcase your talent, FilmJunc helps you
          build your cinematic journey.
        </p>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(15deg); } }
          .animate-float { animation: float 6s ease-in-out infinite; }

          @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-fadeIn { animation: fadeIn 1s ease forwards; }
          .animate-fadeIn.delay-500 { animation-delay: 0.5s; }

          @keyframes pulseSlow { 0%,100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.2); opacity: 0.4; } }
          .animate-pulse-slow { animation: pulseSlow 6s infinite; }
          .animate-pulse-slow.delay-1000 { animation-delay: 1s; }
        `}
      </style>
    </div>
  );
};

export default Home;
