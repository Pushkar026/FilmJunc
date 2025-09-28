import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    profileImage: "",
    bannerImage: "",
    role: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/userprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          location: data.location || "",
          profileImage: data.profileImage || "",
          bannerImage: data.bannerImage || "",
          role: data.role || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/editprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Profile updated:", data);
        navigate("/userprofile");
      } else {
        const errorData = await res.json();
        console.error("Error updating profile:", errorData);
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-red-900 via-red-800 to-red-950 p-6 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-gray-900 shadow-2xl rounded-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-extrabold text-yellow-400 mb-6">
            🎬 Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image */}
            <div>
              <label
                htmlFor="profileImage"
                className="block mb-1 text-yellow-300"
              >
                Profile Image URL
              </label>
              <input
                type="text"
                id="profileImage"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>

            {/* Banner Image */}
            <div>
              <label
                htmlFor="bannerImage"
                className="block mb-1 text-yellow-300"
              >
                Banner Image URL
              </label>
              <input
                type="text"
                id="bannerImage"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={formData.bannerImage}
                onChange={handleChange}
                placeholder="Enter banner image URL"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-1 text-yellow-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block mb-1 text-yellow-300">
                Role
              </label>
              <input
                type="text"
                id="role"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={formData.role}
                onChange={handleChange}
                placeholder="Filmmaker"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block mb-1 text-yellow-300">
                Bio
              </label>
              <textarea
                id="bio"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Passionate filmmaker with a love for storytelling."
              ></textarea>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block mb-1 text-yellow-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={formData.location}
                onChange={handleChange}
                placeholder="Your city"
              />
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-400 text-black rounded-full font-bold hover:bg-yellow-300 shadow-lg transition"
              >
                💾 Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
