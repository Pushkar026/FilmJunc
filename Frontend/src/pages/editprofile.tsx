import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    role: "",
  });

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string>(
    "/images/10337609.png"
  );
  const [bannerImage, setBannerImage] = useState<string>(
    "/images/ChatGPT Image Feb 24, 2026, 03_44_06 PM.png"
  );

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // 🔥 Detect onboarding mode
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isFirstTime = !storedUser.profileCompleted;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/userprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          location: data.location || "",
          role: data.role || "",
        });

        setProfileImage(
          data.profileImage
            ? `${API_BASE_URL}${data.profileImage}`
            : "/images/10337609.png"
        );

        setBannerImage(
          data.bannerImage
            ? `${API_BASE_URL}${data.bannerImage}`
            : "/images/ChatGPT Image Feb 24, 2026, 03_44_06 PM.png"
        );
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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setBannerFile(file);
      setBannerImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔥 Required onboarding validation
    if (!formData.role || !formData.bio || !formData.location) {
      alert("Please fill Role, Bio and Location.");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("bio", formData.bio);
      form.append("location", formData.location);
      form.append("role", formData.role);

      if (profileFile) form.append("profile", profileFile);
      if (bannerFile) form.append("banner", bannerFile);

      const res = await fetch(`${API_BASE_URL}/editprofile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const updatedUser = await res.json();

      if (res.ok) {
        // ✅ Update localStorage user object
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.profileCompleted = updatedUser.profileCompleted;
        localStorage.setItem("user", JSON.stringify(storedUser));

        // 🔥 Always go to dashboard after save
        navigate("/");
      } else {
        alert(updatedUser.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-red-900 via-red-800 to-red-950 flex justify-center">
      <div className="w-full max-w-4xl bg-gray-900 shadow-2xl rounded-xl overflow-hidden mt-6">
        {/* 🔥 Onboarding Banner */}
        {isFirstTime && (
          <div className="bg-yellow-400 text-black text-center py-3 font-semibold">
            🎬 Complete your profile to start discovering creators!
          </div>
        )}

        {/* Banner */}
        <div className="relative h-48 w-full group">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
            onClick={() => bannerInputRef.current?.click()}
          >
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black text-2xl font-bold">
              +
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={bannerInputRef}
            onChange={handleBannerChange}
            className="hidden"
          />
        </div>

        {/* Profile Circle */}
        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-yellow-400 absolute -top-16 left-6 object-cover"
          />
          <div
            className="absolute -top-16 left-6 w-32 h-32 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer"
            onClick={() => profileInputRef.current?.click()}
          >
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black text-2xl font-bold">
              +
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            onChange={handleProfileChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <div className="ml-44 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-yellow-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label htmlFor="role" className="block mb-1 text-yellow-300">
                Role *
              </label>
              <input
                id="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block mb-1 text-yellow-300">
                Bio *
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block mb-1 text-yellow-300">
                Location *
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div className="mt-4">
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
