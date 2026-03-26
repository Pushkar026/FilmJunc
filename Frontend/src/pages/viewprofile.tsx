import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { getImageUrl } from "../utils/getImageUrl";

interface Post {
  _id: string;
  content: string;
  media?: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  location: string;
  profileImage?: string;
  bannerImage?: string;
  socials: {
    instagram?: string;
    website?: string;
  };
  posts?: Post[];
}

type CollabStatus = "none" | "pending" | "accepted" | "rejected";

const ViewProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [collabStatus, setCollabStatus] = useState<CollabStatus>("none");
  const [collabLoading, setCollabLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchCollabStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/collaboration/status/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCollabStatus(data.status);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
    fetchCollabStatus();
  }, [id]);

  const handleCollaborate = async () => {
    if (!id) return;

    try {
      setCollabLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/collaboration/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId: id }),
      });

      if (res.ok) {
        setCollabStatus("pending");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCollabLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎬</div>
          <p className="text-xl font-semibold">Loading profile...</p>
        </div>
      </div>
    );

  if (error || !user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-6xl mb-4">❌</p>
          <p className="text-2xl font-bold">{error || "User not found"}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white relative overflow-hidden">
      {/* Header Navigation */}
      <div className="relative z-20 bg-black/80 backdrop-blur-xl border-b border-yellow-500/20 px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 hover:scale-105 transition duration-300"
        >
          🎬 FilmJunc
        </Link>
        <Link
          to="/userprofile"
          className="px-4 sm:px-6 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-yellow-300 font-bold rounded-full transition-all duration-300 hover:shadow-lg text-sm sm:text-base border border-yellow-400/30"
        >
          ← My Profile
        </Link>
      </div>

      {/* Banner Section */}
      <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
        <img
          src={getImageUrl(user.bannerImage, "/images/default-banner.svg")}
          alt="Banner"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950"></div>
      </div>

      {/* Profile Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-16">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 -mt-20 sm:-mt-24 relative z-10 mb-12">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(user.profileImage)}
              alt="Profile"
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl border-4 border-yellow-400 shadow-2xl object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 flex flex-col justify-end pb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 mb-2">
              {user.name}
            </h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-yellow-300 font-bold rounded-full border border-yellow-400/30">
                {user.role}
              </span>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-300 font-bold rounded-full border border-red-400/30">
                📍 {user.location}
              </span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              {user.bio}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => navigate(`/chatbox/${id}`)}
            className="group relative px-6 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
              💬 Message
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {collabStatus === "none" && (
            <button
              onClick={handleCollaborate}
              disabled={collabLoading}
              className="group relative px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {collabLoading ? "⏳ Sending..." : "🤝 Collaborate"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}

          {collabStatus === "pending" && (
            <button
              disabled
              className="px-6 py-4 bg-slate-700/50 text-yellow-300 font-bold rounded-xl border-2 border-yellow-400/30 cursor-not-allowed opacity-60 text-lg"
            >
              ⏳ Request Pending
            </button>
          )}

          {collabStatus === "accepted" && (
            <button
              disabled
              className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl cursor-default text-lg"
            >
              ✅ Already Collaborators
            </button>
          )}
        </div>

        {/* Posts Section */}
        <div className="relative">
          <div className="mb-10">
            <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
              Posts
            </h2>
            <p className="text-gray-400 text-lg">
              {user.posts && user.posts.length > 0
                ? `${user.posts.length} post${
                    user.posts.length !== 1 ? "s" : ""
                  }`
                : "No posts yet"}
            </p>
          </div>

          {user.posts && user.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {user.posts.map((post, idx) => (
                <div
                  key={post._id}
                  className="group relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-yellow-400/50 shadow-lg hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 hover:scale-105 animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-red-600/0 group-hover:from-yellow-400/10 group-hover:to-red-600/10 transition-all duration-300 pointer-events-none"></div>

                  {post.media && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={getImageUrl(post.media)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        alt="Post media"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    </div>
                  )}

                  <div className="relative p-6 z-10">
                    <p className="text-gray-200 text-lg leading-relaxed mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <time className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      <div className="px-3 py-1 bg-yellow-400/10 text-yellow-300 rounded-full text-xs font-bold border border-yellow-400/30">
                        📍 {user.location}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-400 to-red-600 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-2xl font-bold text-gray-400">No posts yet</p>
              <p className="text-gray-500 mt-2">
                This creator hasn't shared any posts yet
              </p>
            </div>
          )}
        </div>
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

export default ViewProfile;
