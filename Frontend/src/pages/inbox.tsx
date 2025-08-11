import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
          `http://localhost:5000/api/inbox?userId=${currentUserId}`
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
    return <div className="p-4">Loading inbox...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col justify-start">
      {conversations.length > 0 ? (
        conversations.map((conv) => (
          <div
            key={conv._id}
            className="flex items-center gap-4 p-3 border-b hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/chatbox/${conv._id}`)}
          >
            <img
              src={conv.profileImage || "/default-avatar.jpg"}
              alt={conv.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-black">{conv.username}</p>
              <p className="text-sm text-gray-600 truncate">
                {conv.lastMessage || "No messages yet"}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(conv.updatedAt).toLocaleString()}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No conversations yet.</p>
      )}
    </div>
  );
};

export default Inbox;
