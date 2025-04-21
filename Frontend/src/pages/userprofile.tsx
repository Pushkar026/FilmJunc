import { useNavigate } from "react-router-dom";
const UserProfile = () => {
  const navigate = useNavigate();
  // Example user data (replace with props or fetched data)
  const user = {
    name: "Pushkar Yadav",
    role: "Cinematographer",
    location: "Faridabad, India",
    bio: "Passionate about storytelling through lenses. Worked on 10+ short films.",
    profileImage: "/images/profile.jpg",
    bannerImage: "/images/banner.jpg",
    socials: {
      instagram: "https://instagram.com/pushkaryadav001",
      website: "https://films.com",
    },
  };

  return (
    <div className=" min-h-screen mx-auto bg-white shadow-md rounded-xl overflow-hidden">
      {/* Banner */}
      <div className="h-48 w-full bg-gray-200">
        <img
          src={user.bannerImage}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="p-6 relative">
        <div className="absolute -top-16 left-6">
          <img
            src={user.profileImage}
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
            {user.socials.instagram && (
              <a
                href={user.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Instagram
              </a>
            )}
            {user.socials.website && (
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
