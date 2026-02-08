// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./navbar";
import { API_BASE_URL } from "../config";

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
        `${API_BASE_URL}/api/search?location=${encodeURIComponent(searchTerm)}`,
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
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fadeIn">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-700 to-red-800 drop-shadow-[0_0_25px_rgba(139,0,0,0.9)]">
              Welcome to
            </span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 drop-shadow-[0_0_25px_rgba(255,215,0,0.8)]">
              FilmJunc 🎬
            </span>
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
      <div className="relative z-20 w-full text-white p-10 bg-gradient-to-r from-black via-red-950 to-black">
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600">
          WHAT YOU CAN DO
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group bg-gray-900 rounded-2xl shadow-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,215,0,0.6)]">
            <img
              src="images\pikaso_texttoimage_A-dynamic-scene-with-a-diverse-group-of-filmmakers-1024x701.jpeg"
              alt="Find Creators"
              className="w-full h-40 object-cover rounded-xl mb-6 transform transition duration-300 group-hover:scale-105"
            />
            <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600">
              Find Creators
            </h3>
            <p className="text-gray-300">
              Discover filmmakers, writers, and artists around you. Connect and
              collaborate with ease.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-gray-900 rounded-2xl shadow-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,215,0,0.6)]">
            <img
              src="images\brad-pitt-attends-sony-pictures-once-upon-a-time-in-news-photo-1163685599-1564157148.jpg"
              alt="Create Profile"
              className="w-full h-40 object-cover rounded-xl mb-6 transform transition duration-300 group-hover:scale-105"
            />
            <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600">
              Create Your Profile
            </h3>
            <p className="text-gray-300">
              Showcase your skills and build a strong profile to stand out in
              the FilmJunc community.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-gray-900 rounded-2xl shadow-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,215,0,0.6)]">
            <img
              src="images\istockphoto-1372681569-612x612.jpg"
              alt="Post Your Work"
              className="w-full h-40 object-cover rounded-xl mb-6 transform transition duration-300 group-hover:scale-105"
            />
            <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600">
              Post Your Work
            </h3>
            <p className="text-gray-300">
              Share your projects, scripts, and ideas. Get feedback and
              recognition.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="relative w-full py-20 bg-gradient-to-b from-black via-red-950 to-black text-gray-200 overflow-hidden">
        {/* Spotlight Glow Effects */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-yellow-500 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-red-700 rounded-full opacity-10 blur-3xl animate-pulse-slow delay-1000"></div>

        <div className="relative max-w-5xl mx-auto text-center px-6 z-10">
          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 drop-shadow-[0_0_25px_rgba(255,215,0,0.9)]">
            About Us
          </h2>

          {/* Paragraph */}
          <p className="text-lg md:text-xl leading-relaxed text-gray-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.4)] max-w-3xl mx-auto">
            FilmJunc is a collaborative space built for storytellers and
            creators. Our aim is to connect filmmakers, writers,
            cinematographers, sound designers, and every creative mind who
            dreams of bringing stories to life. Whether you’re just starting out
            or already seasoned, FilmJunc helps you showcase your talent,
            discover collaborators near you, and build meaningful projects
            together. We believe cinema is not just an art—it’s a community, and
            FilmJunc is where that community comes alive.
          </p>

          {/* Decorative Divider */}
          <div className="mt-12 w-32 h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-600 mx-auto rounded-full shadow-[0_0_20px_rgba(255,215,0,0.8)]"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-gray-300 mt-10">
        {/* Thin golden line */}
        <div className="border-t border-yellow-500"></div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600">
            FilmJunc 🎬
          </div>

          {/* Made by */}
          <div className="mt-2 md:mt-0 text-gray-300 text-center md:text-left">
            Made by{" "}
            <a
              href="https://www.linkedin.com/in/pushkar-yadav-b654a0251"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold underline"
            >
              Pushkar Yadav
            </a>{" "}
            | 2026 © All rights reserved
          </div>
        </div>
      </footer>

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
