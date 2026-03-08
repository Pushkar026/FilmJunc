import React from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  setIsLoggedIn,
}) => {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    socket.disconnect();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    navigate("/");
  };

  return (
    <nav className="bg-black bg-opacity-70 text-white px-6 py-3 flex justify-between items-center shadow-lg fixed w-full z-50 backdrop-blur-md">
      {/* Left: Brand */}
      <div
        className="text-2xl font-extrabold cursor-pointer text-yellow-400 hover:text-yellow-300 transition"
        onClick={() => navigate("/")}
      >
        🎬 FilmJunc
      </div>

      {/* Center: Search */}
      <div className="flex items-center bg-gray-800 rounded-full px-3 py-1 w-1/3">
        <input
          type="text"
          placeholder="Search for city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="bg-transparent text-white w-full outline-none placeholder-gray-400"
        />
        <button onClick={onSearch} className="text-yellow-400 ml-2">
          🔍
        </button>
      </div>

      {/* Right: Inbox / Profile / Logout */}
      <div className="flex items-center gap-4">
        {/* Inbox */}
        <button
          onClick={() => navigate("/inbox")}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.8)] transition flex items-center gap-2"
        >
          🎤 Inbox
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/userprofile")}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.9)] transition flex items-center gap-2"
        >
          🪑Profile
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-[0_0_25px_rgba(255,0,0,0.9)] transition flex items-center gap-2"
        >
          🎬 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
