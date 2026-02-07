import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newMedia, setNewMedia] = useState<File | null>(null);

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

    fetchUserData();
  }, [navigate]);

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
        setShowModal(false);
        setNewContent("");
        setNewMedia(null);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      <div className="h-48 w-full relative">
        <img
          src={
            user.bannerImage
              ? `${API_BASE_URL}${user.bannerImage}`
              : "/images/default-banner.jpg"
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
                : "/images/default-profile.jpg"
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

          {/* Social Links */}
          <div className="mt-4 flex gap-6">
            {user.socials?.instagram && (
              <a
                href={user.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
              >
                📸 Instagram
              </a>
            )}
            {user.socials?.website && (
              <a
                href={user.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
              >
                🎥 Website
              </a>
            )}
          </div>

          {/* Edit Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/editprofile")}
              className="px-6 py-2 bg-yellow-400 text-black rounded-full font-bold hover:bg-yellow-300 shadow-lg transition flex items-center gap-2"
            >
              🎟️ Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Posts</h2>

        {/* Upload button */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition shadow-md"
        >
          ➕ Upload Post
        </button>

        {/* Posts List */}
        {posts.length === 0 ? (
          <p className="mt-6 text-gray-400 italic">No posts made yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700"
              >
                {post.media && (
                  <img
                    src={`${API_BASE_URL}${post.media}`}
                    alt="Post Media"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">
              Create Post
            </h3>
            <textarea
              placeholder="Write something..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-24 p-2 rounded-md bg-gray-800 text-white mb-3 resize-none"
            ></textarea>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setNewMedia(e.target.files?.[0] || null)}
              className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePostSubmit}
                className="px-4 py-2 bg-yellow-400 text-black rounded-md font-bold hover:bg-yellow-300"
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
