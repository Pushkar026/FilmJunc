import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { getImageUrl } from "../utils/getImageUrl";

interface User {
  name: string;
  role: string;
  location: string;
  bio: string;
  profileImage: string;
  bannerImage: string;
  socials: {
    instagram?: string;
    website?: string;
  };
}

interface Post {
  _id: string;
  content: string;
  media?: string;
  createdAt: string;
}

interface CollaborationRequest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    role: string;
    profileImage?: string;
  };
}

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const [showPostModal, setShowPostModal] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newMedia, setNewMedia] = useState<File | null>(null);

  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [collabCount, setCollabCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_BASE_URL}/userprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
        if (data.posts) setPosts(data.posts);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }

      setLoading(false);
    };

    const fetchCollaboratorsCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/collaboration/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCollabCount(data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
    fetchCollaboratorsCount();
  }, [navigate]);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setReqLoading(true);
      const res = await fetch(`${API_BASE_URL}/collaboration/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setReqLoading(false);
    }
  };

  const respondToRequest = async (
    requestId: string,
    action: "accepted" | "rejected"
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, action }),
      });

      if (res.ok) {
        setRequests((prev) => {
          const updated = prev.filter((r) => r._id !== requestId);

          if (action === "accepted") {
            setSuccessMsg("You’re now collaborators 🎬");
            setCollabCount((c) => c + 1);
          }

          if (updated.length === 0) {
            setTimeout(() => {
              setShowRequests(false);
              setSuccessMsg(null);
            }, 1200);
          }

          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!newContent.trim()) return alert("Content cannot be empty");

    const formData = new FormData();
    formData.append("content", newContent);
    if (newMedia) formData.append("media", newMedia);

    try {
      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const createdPost = await res.json();
        setPosts([createdPost, ...posts]);
        setShowPostModal(false);
        setNewContent("");
        setNewMedia(null);
      }
    } catch (err) {
      console.error(err);
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
  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center text-white">
        <p className="text-2xl">User not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white relative overflow-hidden">
      {/* Header Navigation */}
      <div className="relative z-20 bg-black/80 backdrop-blur-xl border-b border-yellow-500/20 px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 hover:scale-105 transition duration-300"
        >
          🎬 FilmJunc
        </Link>
        <button
          onClick={() => navigate("/editprofile")}
          className="px-4 sm:px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-full transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
        >
          ✏️ Edit
        </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <button
            onClick={() => navigate("/collaborators")}
            className="group relative px-6 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              👥 {collabCount} Collaborators
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => {
              setShowRequests(true);
              fetchRequests();
            }}
            className="group relative px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              🤝 Requests
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => setShowPostModal(true)}
            className="group relative px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-yellow-300 font-bold rounded-xl shadow-lg hover:shadow-2xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              ➕ New Post
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Posts Section */}
        <div className="relative">
          <div className="mb-10">
            <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
              Your Posts
            </h2>
            <p className="text-gray-400 text-lg">
              {posts.length === 0
                ? "Share your journey with the community"
                : `${posts.length} post${posts.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-2xl font-bold text-gray-400 mb-4">
                No posts yet
              </p>
              <p className="text-gray-500 mb-8">
                Share your first post to inspire other creators
              </p>
              <button
                onClick={() => setShowPostModal(true)}
                className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-full transition-all duration-300 hover:shadow-lg"
              >
                ➕ Create Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post, idx) => (
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
                        📍 Public
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-400 to-red-600 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Collaboration Requests Modal */}
      {showRequests && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
              🤝 Collaboration Requests
            </h3>

            {successMsg && (
              <p className="mb-4 text-center px-4 py-3 bg-green-900/30 text-green-300 rounded-lg font-semibold border border-green-500/30">
                ✓ {successMsg}
              </p>
            )}

            {reqLoading ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2 animate-bounce">🔄</div>
                <p className="text-gray-400">Loading requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-400">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl border border-slate-600 hover:border-yellow-400/50 transition-all duration-300"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => {
                        navigate(`/viewprofile/${req.sender._id}`);
                        setShowRequests(false);
                      }}
                    >
                      <img
                        src={getImageUrl(req.sender.profileImage)}
                        className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
                        alt={req.sender.name}
                      />
                      <div>
                        <p className="font-semibold text-yellow-300 hover:text-yellow-200 transition-colors">
                          {req.sender.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {req.sender.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => respondToRequest(req._id, "accepted")}
                        className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-lg text-sm transition-all duration-300"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => respondToRequest(req._id, "rejected")}
                        className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 font-bold rounded-lg text-sm border border-red-500/50 transition-all duration-300"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => setShowRequests(false)}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
              ✨ Create Post
            </h3>

            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Share your thoughts, projects, or ideas..."
              className="w-full h-32 p-4 rounded-xl bg-slate-700/50 text-white border border-slate-600 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 resize-none mb-4 placeholder-gray-500"
            />

            <label className="block mb-6">
              <span className="text-sm text-gray-400 mb-2 inline-block">
                📷 Add Media (Optional)
              </span>
              <input
                type="file"
                onChange={(e) => setNewMedia(e.target.files?.[0] || null)}
                className="w-full p-3 rounded-xl bg-slate-700/50 text-gray-400 border border-slate-600 focus:border-yellow-400 cursor-pointer hover:bg-slate-700 transition-colors"
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPostModal(false)}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePostSubmit}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                📤 Post
              </button>
            </div>
          </div>
        </div>
      )}

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

export default UserProfile;
