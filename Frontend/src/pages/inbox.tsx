import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { getImageUrl } from "../utils/getImageUrl";

interface Conversation {
  _id: string;
  username: string;
  profileImage?: string;
  lastMessage?: string;
  updatedAt: string;
}

interface InboxProps {
  currentUserId: string;
}

const Inbox: React.FC<InboxProps> = ({ currentUserId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/inbox?userId=${currentUserId}`
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          console.error("Unexpected inbox data:", data);
          setConversations([]);
        }
      } catch (error) {
        console.error("Error fetching inbox:", error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-yellow-400 text-lg animate-pulse">
        Loading inbox...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-black p-4 flex flex-col gap-3">
      {/* 🔥 Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="text-2xl font-extrabold text-yellow-400 
                     hover:text-yellow-300 hover:scale-105 
                     transition duration-300"
        >
          🎬 FilmJunc
        </Link>

        <h1 className="text-2xl text-yellow-400 font-bold">Your Inbox</h1>
      </div>

      {conversations.length > 0 ? (
        conversations.map((conv) => (
          <div
            key={conv._id}
            className="flex items-center gap-4 p-3 rounded-xl cursor-pointer 
                       bg-gray-900 hover:bg-red-900 transition duration-300 
                       hover:shadow-[0_0_20px_rgba(255,215,0,0.7)]"
            onClick={() => navigate(`/chatbox/${conv._id}`)}
          >
            <img
              src={getImageUrl(conv.profileImage)}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-bold text-yellow-400">{conv.username}</p>
              <p className="text-sm text-gray-300 truncate">
                {conv.lastMessage || "No messages yet 🎤"}
              </p>
            </div>
            <div className="text-xs text-gray-400">
              {new Date(conv.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center mt-4 animate-pulse">
          No conversations yet 🎬
        </p>
      )}
    </div>
  );
};

export default Inbox;
