import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Listen to changes in localStorage (token) and update login status
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleProfileClick = () => {
    navigate("/userprofile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update the state to reflect logout
    navigate("/"); // Redirect to home page
  };

  const handleSearch = async () => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      // If the token is missing, inform the user or redirect to login
      alert("You must be logged in to perform a search.");
      return; // Stop the search if no token
    }

    if (!searchTerm.trim()) return; // Prevent empty search

    try {
      // Send the token in the Authorization header
      const response = await fetch(
        `http://localhost:5000/api/search?location=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET", // Use GET method for searching
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );

      if (!response.ok) {
        // Handle response failure (non-200 status codes)
        throw new Error("Search failed with status: " + response.status);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleresult = () => {
    navigate(`/searchresult?location=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="w-full h-screen relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 text-white p-4">
      {/* 🔍 Search bar - top left */}
      {isLoggedIn && (
        <div className="absolute top-4 left-4">
          <input
            type="text"
            placeholder="Search for city "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
                handleresult();
              }
            }}
            className="px-4 py-2 rounded-lg text-white"
          />
        </div>
      )}

      {/* Search Result*/}

      {/* 👤 User icon - top right */}
      {isLoggedIn && (
        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={handleProfileClick}
        >
          <span className="text-2xl hover:opacity-80 transition">👤</span>
        </div>
      )}

      {/* 💬 Messaging icon */}
      {isLoggedIn && (
        <div
          className="absolute top-14 right-4 cursor-pointer"
          onClick={() => (window.location.href = "/inbox")} // Change to your routing method
        >
          <span className="text-2xl hover:opacity-80 transition">💬</span>
        </div>
      )}

      {/* Logout Button - only visible if logged in */}
      {isLoggedIn && (
        <div className="absolute top-4 right-16">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}

      {/* 🌟 Main content */}
      <h1 className="text-5xl font-bold mb-4 text-center">
        Welcome to <span className="text-yellow-400">FilmJunc 🎬</span>
      </h1>
      <p className="text-lg text-gray-300 text-center max-w-md">
        Connect with filmmakers, writers, editors, and other creators around
        you. Start collaborating and creating today.
      </p>

      {/* Login/Signup buttons if not logged in */}
      {!isLoggedIn && (
        <div className="mt-8 flex space-x-4">
          <a
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-white font-semibold transition"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-gray-100 hover:bg-white text-gray-800 px-6 py-2 rounded-xl font-semibold transition"
          >
            Sign Up
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
