import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { getImageUrl } from "../utils/getImageUrl";
import SkeletonLoader from "../components/SkeletonLoader";

interface User {
  _id: string;
  name: string;
  role: string;
  location: string;
  bio?: string;
  profileImage?: string;
}

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchLocation = queryParams.get("location");

  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      if (!token || !searchLocation) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/search?location=${encodeURIComponent(
            searchLocation
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch search results");

        const data = await response.json();
        setSearchResult(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchLocation]);

  const icons = ["🎬", "🎥", "🎤", "🍿"];
  const iconPositions = [
    { top: "10%", left: "5%" },
    { top: "25%", left: "80%" },
    { top: "60%", left: "20%" },
    { top: "75%", left: "70%" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white overflow-hidden">
      {/* Header with Logo */}
      <div className="relative z-20 bg-black/80 backdrop-blur-xl border-b border-yellow-500/20 px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 hover:scale-105 transition duration-300"
        >
          🎬 FilmJunc
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-yellow-300 font-bold rounded-full transition-all duration-300 hover:shadow-lg text-sm sm:text-base border border-yellow-400/30"
        >
          ← Back
        </button>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-red-600 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>

        {/* Floating Icons */}
        {icons.map((icon, idx) => (
          <span
            key={idx}
            className="absolute text-5xl md:text-6xl opacity-10 animate-float pointer-events-none"
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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        {/* Section Header */}
        <div className="mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            Creators in {searchLocation}
          </h1>
          <p className="text-lg text-gray-300 font-medium">
            Connect with talented filmmakers, writers, and artists near you
          </p>
        </div>

        {loading ? (
          <SkeletonLoader count={6} type="card" />
        ) : searchResult.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6 animate-bounce">🔍</div>
            <p className="text-3xl font-bold text-yellow-400 mb-4">
              No creators found yet
            </p>
            <p className="text-gray-300 text-lg mb-8">
              Try searching for a different location
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-full transition-all duration-300 hover:shadow-xl"
            >
              ← Back Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResult.map((user, idx) => (
              <div
                key={user._id}
                className="group relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 border border-slate-700 hover:border-yellow-400/50 shadow-lg hover:shadow-2xl hover:shadow-yellow-400/20 animate-fadeIn"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => navigate(`/viewprofile/${user._id}`)}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-red-600/0 group-hover:from-yellow-400/10 group-hover:to-red-600/10 transition-all duration-300 pointer-events-none"></div>

                {/* Profile Image Section */}
                <div className="relative pt-8 pb-4 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <img
                    src={getImageUrl(user.profileImage)}
                    alt={`${user.name}'s profile`}
                    className="w-40 h-40 rounded-full border-4 border-yellow-400/50 group-hover:border-yellow-300 shadow-lg object-cover mx-auto transition-all duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Info Section */}
                <div className="relative px-6 pb-8 text-center z-10">
                  <h2 className="text-2xl font-black mb-2 text-white group-hover:text-yellow-300 transition-colors duration-300">
                    {user.name}
                  </h2>

                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-yellow-300 font-bold rounded-full text-sm border border-yellow-400/30 group-hover:border-yellow-300 transition-colors">
                      {user.role}
                    </span>
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-300 font-bold rounded-full text-sm border border-red-400/30">
                      📍 {user.location}
                    </span>
                  </div>

                  {user.bio && (
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                      {user.bio}
                    </p>
                  )}

                  {/* View Profile Button */}
                  <button className="w-full group/btn relative px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      👤 View Profile
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-400 to-red-600 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Animation */}
      <style>
        {`
          @keyframes float { 
            0%,100% { transform: translateY(0) rotate(0deg); } 
            50% { transform: translateY(-20px) rotate(15deg); } 
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          .delay-1000 { animation-delay: 1s; }
          .line-clamp-3 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
        `}
      </style>
    </div>
  );
};

export default SearchResult;
