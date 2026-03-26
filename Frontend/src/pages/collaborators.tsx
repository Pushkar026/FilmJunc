import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { getImageUrl } from "../utils/getImageUrl";

interface Collaborator {
  _id: string;
  name: string;
  role: string;
  profileImage?: string;
}

const Collaborators = () => {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/collaboration/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setCollaborators(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎬</div>
          <p className="text-xl font-semibold">Loading collaborators...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white overflow-hidden">
      {/* Header Navigation */}
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        {/* Section Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            👥 Your Collaborators
          </h1>
          <p className="text-gray-400 text-lg">
            {collaborators.length === 0
              ? "You haven't collaborated with anyone yet"
              : `You have ${collaborators.length} collaborator${
                  collaborators.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        {collaborators.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤝</div>
            <p className="text-2xl font-bold text-gray-400 mb-3">
              No collaborators yet
            </p>
            <p className="text-gray-500 mb-8">
              Start connecting with creators to build your network
            </p>
            <Link
              to="/userprofile"
              className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-full transition-all duration-300 hover:shadow-lg"
            >
              🔍 Find Creators
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collaborators.map((c, idx) => (
              <div
                key={c._id}
                className="group relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl overflow-hidden cursor-pointer border border-slate-700 hover:border-yellow-400/50 shadow-lg hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 hover:scale-105 animate-fadeIn"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => navigate(`/viewprofile/${c._id}`)}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-red-600/0 group-hover:from-yellow-400/10 group-hover:to-red-600/10 transition-all duration-300 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 p-6 text-center">
                  <img
                    src={getImageUrl(c.profileImage)}
                    className="w-24 h-24 mx-auto rounded-full border-4 border-yellow-400 shadow-lg object-cover mb-4 group-hover:scale-110 transition-transform duration-300"
                    alt={c.name}
                  />
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-yellow-300 transition-colors">
                    {c.name}
                  </h3>
                  <p className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-yellow-300 font-bold rounded-full text-sm border border-yellow-400/30 group-hover:border-yellow-300 transition-colors">
                    {c.role}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-400 to-red-600 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
          .animate-bounce { animation: bounce 1s infinite; }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
    </div>
  );
};

export default Collaborators;
