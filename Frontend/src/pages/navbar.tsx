import React from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

interface NavbarProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    socket.disconnect();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    navigate("/");
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-gradient-to-b from-black/90 via-black/85 to-black/70 backdrop-blur-2xl border-b border-yellow-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        {/* Left: Brand with glow effect */}
        <div
          className="group cursor-pointer flex items-center gap-3 hover:scale-105 transition-transform duration-300"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative text-2xl md:text-3xl">🎬</div>
          </div>
          <h1 className="hidden sm:block text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-lg">
            FilmJunc
          </h1>
        </div>

        {/* Center: Divider */}
        <div className="hidden lg:block flex-1 max-w-xs mx-8">
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
        </div>

        {/* Right: Navigation Buttons */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Inbox Button */}
          <button
            onClick={() => navigate("/inbox")}
            className="group relative px-3 md:px-6 py-3 rounded-xl font-bold transition-all duration-300 overflow-hidden text-sm md:text-base flex items-center gap-2"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-red-700/80 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/60 to-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-lg bg-red-500/50"></div>

            {/* Content */}
            <span className="relative z-10 text-white flex items-center gap-2">
              <span className="text-lg">📬</span>
              <span className="hidden md:inline">Inbox</span>
            </span>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-xl border border-red-400/0 group-hover:border-red-400/50 transition-all duration-300"></div>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => navigate("/userprofile")}
            className="group relative px-3 md:px-6 py-3 rounded-xl font-bold transition-all duration-300 overflow-hidden text-sm md:text-base flex items-center gap-2"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/90 to-amber-500/90 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 to-amber-400/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-lg bg-yellow-400/60"></div>

            {/* Content */}
            <span className="relative z-10 text-black flex items-center gap-2 font-bold">
              <span className="text-lg">👤</span>
              <span className="hidden md:inline">Profile</span>
            </span>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-xl border border-yellow-300/0 group-hover:border-yellow-300/70 transition-all duration-300"></div>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group relative px-3 md:px-6 py-3 rounded-xl font-bold transition-all duration-300 overflow-hidden text-sm md:text-base flex items-center gap-2"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-xl border border-slate-600/50"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-slate-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-lg bg-red-600/40"></div>

            {/* Content */}
            <span className="relative z-10 text-white flex items-center gap-2">
              <span className="text-lg">🚪</span>
              <span className="hidden md:inline">Logout</span>
            </span>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-xl border border-red-500/0 group-hover:border-red-500/50 transition-all duration-300"></div>
          </button>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-yellow-500/0 via-yellow-500/50 to-yellow-500/0"></div>
    </nav>
  );
};

export default Navbar;
