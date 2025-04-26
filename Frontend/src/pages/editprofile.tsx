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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const res = await fetch("http://localhost:5000/editprofile", {
        method: "PUT", // Use PUT to update the profile
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // Send the form data as the request body
      });

      if (res.ok) {
        // Profile updated successfully
        const data = await res.json();
        console.log("Profile updated:", data);
        // You can show a success message or redirect the user here
        navigate("/userprofile");
      } else {
        // Handle errors (e.g., display error message)
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className="mb-4">
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image
              </label>
              <input
                type="text"
                id="profileImage"
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>

            {/* Banner Image */}
            <div className="mb-4">
              <label
                htmlFor="bannerImage"
                className="block text-sm font-medium text-gray-700"
              >
                Banner Image
              </label>
              <input
                type="text"
                id="bannerImage"
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.bannerImage}
                onChange={handleChange}
                placeholder="Enter banner image URL"
              />
            </div>

            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.name}
                onChange={handleChange}
                placeholder="ENTER YOUR NAME"
              />
            </div>

            {/* Role */}
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <input
                type="text"
                id="role"
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.role}
                onChange={handleChange}
                placeholder="Filmmaker"
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Passionate filmmaker with a love for storytelling."
              ></textarea>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
