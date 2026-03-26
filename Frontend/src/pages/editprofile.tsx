import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { getImageUrl } from "../utils/getImageUrl";

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
    "/images/default-banner.svg"
  );

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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

        // ✅ Use helper instead of prefixing
        setProfileImage(getImageUrl(data.profileImage, "/images/10337609.png"));

        setBannerImage(
          getImageUrl(data.bannerImage, "/images/default-banner.svg")
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
      setProfileImage(URL.createObjectURL(file)); // preview
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setBannerFile(file);
      setBannerImage(URL.createObjectURL(file)); // preview
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.profileCompleted = updatedUser.profileCompleted;
        localStorage.setItem("user", JSON.stringify(storedUser));

        navigate("/userprofile");
      } else {
        alert(updatedUser.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white overflow-hidden">
      {/* Header Navigation */}
      <div className="relative z-20 bg-black/80 backdrop-blur-xl border-b border-yellow-500/20 px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 hover:scale-105 transition duration-300"
        >
          🎬 FilmJunc
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-yellow-300 font-bold rounded-full transition-all duration-300 hover:shadow-lg text-sm sm:text-base border border-yellow-400/30"
        >
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        {/* Header */}
        {isFirstTime && (
          <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border-l-4 border-yellow-400 rounded-lg animate-fadeIn">
            <p className="text-yellow-300 font-semibold text-lg">
              ✨ Complete your profile to start discovering creators!
            </p>
          </div>
        )}

        <div className="mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            ✏️ Edit Your Profile
          </h1>
          <p className="text-gray-400 text-lg">
            {isFirstTime
              ? "Set up your profile to start collaborating"
              : "Update your profile information"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
          {/* Banner Section */}
          <div className="relative h-64 sm:h-72 md:h-80 w-full group overflow-hidden cursor-pointer">
            <img
              src={bannerImage}
              alt="Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">📷</div>
                <p className="text-white font-semibold">
                  Click to change banner
                </p>
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

          {/* Profile Form */}
          <div className="relative px-4 sm:px-8 md:px-12 pb-12">
            {/* Profile Image */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8 -mt-20 sm:-mt-24 relative z-10 mb-8">
              <div className="group relative flex-shrink-0">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl border-4 border-yellow-400 shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => profileInputRef.current?.click()}
                />
                <div className="absolute inset-0 rounded-2xl bg-black/40 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-4xl">📷</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={profileInputRef}
                  onChange={handleProfileChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-2">👤 Profile Photo</p>
                <p className="text-gray-500 text-xs">
                  Click on the image to change your profile photo
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "0.1s" }}
              >
                <label
                  htmlFor="name"
                  className="block mb-2 font-bold text-gray-200"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-6 py-3 rounded-xl bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-slate-600 focus:border-yellow-400 transition-all duration-300"
                />
              </div>

              {/* Role */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "0.2s" }}
              >
                <label
                  htmlFor="role"
                  className="block mb-2 font-bold text-gray-200"
                >
                  Role <span className="text-red-400">*</span>
                </label>
                <input
                  id="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Filmmaker, Actor, Writer, Director..."
                  className="w-full px-6 py-3 rounded-xl bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-slate-600 focus:border-yellow-400 transition-all duration-300"
                  required
                />
              </div>

              {/* Location */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "0.3s" }}
              >
                <label
                  htmlFor="location"
                  className="block mb-2 font-bold text-gray-200"
                >
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, Los Angeles, Mumbai..."
                  className="w-full px-6 py-3 rounded-xl bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-slate-600 focus:border-yellow-400 transition-all duration-300"
                  required
                />
              </div>

              {/* Bio */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "0.4s" }}
              >
                <label
                  htmlFor="bio"
                  className="block mb-2 font-bold text-gray-200"
                >
                  Bio <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell other creators about yourself, your experience, and what you're looking for..."
                  rows={4}
                  className="w-full px-6 py-3 rounded-xl bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-slate-600 focus:border-yellow-400 transition-all duration-300 resize-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 pt-6 animate-fadeIn"
                style={{ animationDelay: "0.5s" }}
              >
                <button
                  type="submit"
                  className="group relative flex-1 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    💾 Save Changes
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg rounded-xl border border-slate-600 hover:border-slate-500 shadow-lg transition-all duration-300"
                >
                  ← Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        `}
      </style>
    </div>
  );
};

export default EditProfile;
