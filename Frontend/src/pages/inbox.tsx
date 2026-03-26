import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { getImageUrl } from "../utils/getImageUrl";
import SkeletonLoader from "../components/SkeletonLoader";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 mb-8">
            💬 Inbox
          </h1>
          <SkeletonLoader count={5} type="message" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header Navigation */}
      <div className="relative z-20 bg-black/80 backdrop-blur-xl border-b border-yellow-500/20 px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 hover:scale-105 transition duration-300"
        >
          🎬 FilmJunc
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Section Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            💬 Your Conversations
          </h1>
          <p className="text-gray-400 text-lg">
            {conversations.length === 0
              ? "No conversations yet"
              : `${conversations.length} conversation${
                  conversations.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        {conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conv, idx) => (
              <div
                key={conv._id}
                className="group relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 cursor-pointer border border-slate-700 hover:border-yellow-400/50 shadow-lg hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 hover:scale-102 animate-fadeIn"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => navigate(`/chatbox/${conv._id}`)}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-red-600/0 group-hover:from-yellow-400/10 group-hover:to-red-600/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(conv.profileImage)}
                      alt={conv.username}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 border-yellow-400 shadow-lg object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors mb-1">
                      {conv.username}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base truncate group-hover:text-gray-300 transition-colors">
                      {conv.lastMessage || "No messages yet 🎤"}
                    </p>
                  </div>

                  {/* Time & Arrow */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs sm:text-sm text-gray-500 group-hover:text-yellow-300 transition-colors">
                      {new Date(conv.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="text-2xl transform group-hover:translate-x-2 transition-transform duration-300">
                      →
                    </div>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-400 to-red-600 transition-all duration-300 rounded-b-2xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">📭</div>
            <p className="text-2xl font-bold text-gray-400 mb-3">
              No conversations yet
            </p>
            <p className="text-gray-500 mb-8">
              Start a conversation with creators you find
            </p>
            <Link
              to="/userprofile"
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-full transition-all duration-300 hover:shadow-lg"
            >
              🔍 Find Creators
            </Link>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
          .animate-bounce { animation: bounce 1s infinite; }
          .hover\\:scale-102:hover { transform: scale(1.02); }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
    </div>
  );
};

export default Inbox;
