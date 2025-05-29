import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  role: string;
  location: string;
  bio?: string;
  profileImage?: string;
}

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchLocation = queryParams.get("location");

  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      if (!token || !searchLocation) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/search?location=${encodeURIComponent(
            searchLocation
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        setSearchResult(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchLocation]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">
        Filmakers and Creators in "{searchLocation}"
      </h1>

      {loading ? (
        <p className="text-lg">Loading...</p>
      ) : searchResult.length === 0 ? (
        <p className="text-lg">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {searchResult.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-lg rounded-2xl p-4 text-gray-900"
            >
              <img
                src={user.profileImage || "/default-profile.jpg"}
                alt={`${user.name}'s profile`}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">
                {user.role} from {user.location}
              </p>
              {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResult;
