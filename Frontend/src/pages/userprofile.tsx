import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the TypeScript interface for the user
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
  const [user, setUser] = useState<User | null>(null); // Define the type for the user state
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const res = await fetch("http://localhost:5000/userprofile", {
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data); // Set the user data in the state
      } else {
        // Handle error (e.g., unauthorized or no data found)
        console.error("Failed to fetch user data ");
        navigate("/login"); // Redirect to login if not authorized
      }
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchUserData();
  }, [navigate]);

  // If data is loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user data available
  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="min-h-screen mx-auto bg-white shadow-md rounded-xl overflow-hidden">
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
            {/* Edit Button */}
            <div className="mt-6">
              <button
                onClick={() => navigate("/editprofile")} // Navigate to Edit Profile
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
