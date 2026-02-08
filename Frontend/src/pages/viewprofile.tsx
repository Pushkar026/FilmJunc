import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

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
        setCollabStatus("pending"); // 🔥 instant UI update
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCollabLoading(false);
    }
  };

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
              ? `${API_BASE_URL}${user.bannerImage}`
              : "/images/default-banner.jpg"
          }
          alt="Banner"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Profile */}
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="absolute -top-16 left-6">
          <img
            src={
              user.profileImage
                ? `${API_BASE_URL}${user.profileImage}`
                : "/images/default-profile.jpg"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover"
          />
        </div>

        <div className="ml-40 pt-6">
          <h1 className="text-3xl font-extrabold text-yellow-400">
            {user.name}
          </h1>
          <p className="text-yellow-200">{user.role}</p>
          <p className="text-yellow-300">{user.location}</p>
          <p className="mt-4 text-gray-200">{user.bio}</p>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={() => navigate(`/chatbox/${id}`)}
              className="bg-yellow-400 text-black py-2 px-6 rounded-full font-bold hover:bg-yellow-300"
            >
              💬 Message
            </button>

            {collabStatus === "none" && (
              <button
                onClick={handleCollaborate}
                disabled={collabLoading}
                className="border-2 border-yellow-400 text-yellow-400 py-2 px-6 rounded-full hover:bg-yellow-400 hover:text-black font-bold"
              >
                {collabLoading ? "Sending..." : "Collaborate"}
              </button>
            )}

            {collabStatus === "pending" && (
              <button
                disabled
                className="border-2 border-yellow-400 text-yellow-400 py-2 px-6 rounded-full opacity-60 cursor-not-allowed"
              >
                Requested
              </button>
            )}

            {collabStatus === "accepted" && (
              <button
                disabled
                className="bg-yellow-400 text-black py-2 px-6 rounded-full font-bold cursor-default"
              >
                🤝 Collaborators
              </button>
            )}
          </div>
        </div>

        {/* Posts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Posts</h2>

          {user.posts && user.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user.posts.map((post) => (
                <div key={post._id} className="bg-gray-800 p-4 rounded-xl">
                  {post.media && (
                    <img
                      src={`${API_BASE_URL}${post.media}`}
                      className="w-full h-48 object-cover rounded-md mb-2"
                    />
                  )}
                  <p>{post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
