import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

const ViewProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (error || !user)
    return <p className="text-white p-6">{error || "User not found"}</p>;

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Banner */}
      <div className="h-48 w-full relative">
        <img
          src={
            user.bannerImage
              ? `http://localhost:5000${user.bannerImage}`
              : "/images/default-banner.jpg"
          }
          alt="Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* Profile Section */}
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="absolute -top-16 left-6">
          <img
            src={
              user.profileImage
                ? `http://localhost:5000${user.profileImage}`
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

          {/* Message Button */}
          <button
            className="mt-6 bg-yellow-400 text-black py-2 px-6 rounded-full hover:bg-yellow-300 font-bold flex items-center gap-2 shadow-lg"
            onClick={() => navigate(`/chatbox/${id}`)}
          >
            💬 Message
          </button>
        </div>

        {/* User Posts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Posts</h2>
          {user.posts && user.posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {user.posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-800/70 shadow-lg rounded-2xl p-4 text-white backdrop-blur-md"
                >
                  {post.media && (
                    <img
                      src={`http://localhost:5000${post.media}`}
                      alt="Post Media"
                      className="w-full h-48 object-cover rounded-md mb-2"
                    />
                  )}
                  <p className="text-gray-200">{post.content}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-200">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
