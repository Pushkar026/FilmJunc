import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

interface Collaborator {
  _id: string;
  name: string;
  role: string;
  profileImage?: string;
}

const Collaborators = () => {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/collaboration/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setCollaborators(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, []);

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          Collaborators
        </h1>

        {collaborators.length === 0 ? (
          <p className="text-gray-400">No collaborators yet.</p>
        ) : (
          <div className="space-y-4">
            {collaborators.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/viewprofile/${c._id}`)}
                className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl cursor-pointer hover:bg-gray-800 transition"
              >
                <img
                  src={
                    c.profileImage
                      ? `${API_BASE_URL}${c.profileImage}`
                      : "/images/default-profile.jpg"
                  }
                  className="w-14 h-14 rounded-full border-2 border-yellow-400 object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-yellow-300">
                    {c.name}
                  </p>
                  <p className="text-sm text-gray-400">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collaborators;
