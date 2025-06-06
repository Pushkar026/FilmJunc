import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
}

const ViewProfile = () => {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Under Construction...");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !user) return <p>{error || "User not found"}</p>;

  return (
    <div className="min-h-screen w-full bg-white shadow-md rounded-xl overflow-hidden">
      {/* Banner */}
      <div className="h-48 w-full bg-gray-200">
        <img
          src={user.bannerImage || "/images/default-banner.jpg"}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="p-6 relative">
        <div className="absolute -top-16 left-6">
          <img
            src={user.profileImage || "/images/default-profile.jpg"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>

        <div className="ml-40">
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600 mt-1">{user.role}</p>
          <p className="text-sm text-gray-500">{user.location}</p>
          <p className="mt-4 text-gray-700">{user.bio}</p>

          {/* Social Links */}
          <div className="mt-4 flex gap-4">
            {user.socials?.instagram && (
              <a
                href={user.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Instagram
              </a>
            )}
            {user.socials?.website && (
              <a
                href={user.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Website
              </a>
            )}
          </div>

          {/* Message Button */}
          <button
            className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 block"
            onClick={() => navigate(`/chatbox/${id}`)}
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
