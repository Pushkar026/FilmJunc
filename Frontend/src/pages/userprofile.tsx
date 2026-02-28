import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

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

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* 🎬 FilmJunc Logo - Top Left */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-2xl font-extrabold text-yellow-400 hover:text-yellow-300 hover:scale-105 transition duration-300 z-50"
      >
        🎬 FilmJunc
      </Link>

      {/* Banner */}
      <div className="h-48 w-full relative">
        <img
          src={
            user.bannerImage
              ? `${API_BASE_URL}${user.bannerImage}`
              : "/images/ChatGPT Image Feb 24, 2026, 03_44_06 PM.png"
          }
          alt="Banner"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Profile Section */}
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="absolute -top-16 left-6">
          <img
            src={
              user.profileImage
                ? `${API_BASE_URL}${user.profileImage}`
                : "/images/10337609.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-lg object-cover"
          />
        </div>

        <div className="ml-40 pt-6">
          <h1 className="text-3xl font-extrabold text-yellow-400">
            {user.name}
          </h1>
          <p className="text-yellow-200 mt-1">{user.role}</p>
          <p className="text-yellow-300">{user.location}</p>
          <p className="mt-4 text-gray-200">{user.bio}</p>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/editprofile")}
              className="px-6 py-2 bg-yellow-400 text-black rounded-full font-bold hover:bg-yellow-300"
            >
              🎟️ Edit Profile
            </button>

            <button
              onClick={() => navigate("/collaborators")}
              className="px-6 py-2 bg-yellow-400 text-black rounded-full font-bold hover:bg-yellow-300"
            >
              {collabCount} Collaborators
            </button>

            <button
              onClick={() => {
                setShowRequests(true);
                fetchRequests();
              }}
              className="px-6 py-2 border-2 border-yellow-400 text-yellow-400 rounded-full font-bold hover:bg-yellow-400 hover:text-black"
            >
              🤝 Collaboration Requests
            </button>
          </div>
        </div>
      </div>

      {/* Collaboration Requests Modal */}
      {showRequests && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">
              Collaboration Requests
            </h3>

            {successMsg && (
              <p className="mb-3 text-sm text-green-400">{successMsg}</p>
            )}

            {reqLoading ? (
              <p>Loading...</p>
            ) : requests.length === 0 ? (
              <p className="text-gray-400">No pending requests</p>
            ) : (
              requests.map((req) => (
                <div
                  key={req._id}
                  className="flex items-center justify-between bg-gray-800 p-3 rounded-lg mb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        req.sender.profileImage
                          ? `${API_BASE_URL}${req.sender.profileImage}`
                          : "images/10337609.png"
                      }
                      className="w-12 h-12 rounded-full border-2 border-yellow-400 cursor-pointer"
                      onClick={() => navigate(`/viewprofile/${req.sender._id}`)}
                    />
                    <div>
                      <p
                        className="font-semibold text-yellow-300 cursor-pointer hover:underline"
                        onClick={() =>
                          navigate(`/viewprofile/${req.sender._id}`)
                        }
                      >
                        {req.sender.name}
                      </p>
                      <p className="text-sm text-gray-400">{req.sender.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => respondToRequest(req._id, "accepted")}
                      className="px-3 py-1 bg-yellow-400 text-black rounded-md font-bold"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondToRequest(req._id, "rejected")}
                      className="px-3 py-1 border border-yellow-400 text-yellow-400 rounded-md"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="mt-4 text-right">
              <button
                onClick={() => setShowRequests(false)}
                className="px-4 py-2 bg-gray-700 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Posts</h2>

        <button
          onClick={() => setShowPostModal(true)}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold"
        >
          ➕ Upload Post
        </button>

        {posts.length === 0 ? (
          <p className="mt-6 text-gray-400 italic">No posts made yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-900 p-4 rounded-xl border border-gray-700"
              >
                {post.media && (
                  <img
                    src={`${API_BASE_URL}${post.media}`}
                    className="w-full h-60 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-gray-200 mb-2">{post.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">
              Create Post
            </h3>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-24 p-2 rounded-md bg-gray-800 text-white mb-3"
            />
            <input
              type="file"
              onChange={(e) => setNewMedia(e.target.files?.[0] || null)}
              className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPostModal(false)}
                className="px-4 py-2 bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePostSubmit}
                className="px-4 py-2 bg-yellow-400 text-black rounded-md font-bold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
