const EditProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Edit Profile
          </h1>

          <form>
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
                placeholder="John Doe"
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
                placeholder="New York, USA"
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
