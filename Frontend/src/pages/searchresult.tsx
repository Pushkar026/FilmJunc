import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

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
      if (!token || !searchLocation) return;

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

  // Floating icons positions
  const icons = ["🎬", "🎥", "🎤", "🍿"];
  const iconPositions = [
    { top: "10%", left: "5%" },
    { top: "25%", left: "80%" },
    { top: "60%", left: "20%" },
    { top: "75%", left: "70%" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white p-6 overflow-hidden">
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

      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-yellow-100">
          Filmmakers and Creators in "{searchLocation}"
        </h1>

        {loading ? (
          <p className="text-lg">Loading...</p>
        ) : searchResult.length === 0 ? (
          <p className="text-lg">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {searchResult.map((user) => (
              <div
                key={user._id}
                className="bg-gray-800/70 shadow-lg rounded-2xl p-4 text-white backdrop-blur-md cursor-pointer transition transform hover:scale-105 hover:shadow-yellow-400/50"
                onClick={() => navigate(`/viewprofile/${user._id}`)}
              >
                <img
                  src={
                    user.profileImage
                      ? `http://localhost:5000${user.profileImage}`
                      : "/default-profile.jpg"
                  }
                  alt={`${user.name}'s profile`}
                  className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-md object-cover mx-auto"
                />
                <h2 className="text-xl font-semibold mt-4 text-yellow-300 text-center">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-200 text-center">
                  {user.role} from {user.location}
                </p>
                {user.bio && (
                  <p className="mt-2 text-gray-200 text-center">{user.bio}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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

export default SearchResult;
