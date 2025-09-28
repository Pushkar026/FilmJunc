import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/userprofile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user data");
        navigate("/login");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      <div className="h-48 w-full relative">
        <img
          src={user.bannerImage || "/images/default-banner.jpg"}
          alt="Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* Profile Section */}
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="absolute -top-16 left-6">
          <img
            src={user.profileImage || "/images/default-profile.jpg"}
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
    </div>
  );
};

export default UserProfile;
