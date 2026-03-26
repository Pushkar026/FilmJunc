import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { socket } from "../socket";
import { getImageUrl } from "../utils/getImageUrl";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: Date;
}

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

interface ChatBoxProps {
  currentUserId: string;
  selectedUserId: string;
}

interface TypingEvent {
  senderId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ currentUserId, selectedUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [typing, setTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // ================= RECEIVE MESSAGE =================
  useEffect(() => {
    const handleReceive = (data: Message) => {
      if (
        data.senderId === selectedUserId &&
        data.receiverId === currentUserId
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [selectedUserId, currentUserId]);

  // ================= TYPING EVENTS =================
  useEffect(() => {
    const typingHandler = (data: TypingEvent) => {
      if (data.senderId === selectedUserId) {
        setTyping(true);
      }
    };

    const stopTypingHandler = () => {
      setTyping(false);
    };

    socket.on("typing", typingHandler);
    socket.on("stop_typing", stopTypingHandler);

    return () => {
      socket.off("typing", typingHandler);
      socket.off("stop_typing", stopTypingHandler);
    };
  }, [selectedUserId]);

  // ================= FETCH CHAT HISTORY =================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/messages?user1=${currentUserId}&user2=${selectedUserId}`
        );

        const data = await res.json();

        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [currentUserId, selectedUserId]);

  // ================= FETCH USER PROFILE =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/api/users/${selectedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setSelectedUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [selectedUserId]);

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!text.trim()) return;

    const newMessage = {
      senderId: currentUserId,
      receiverId: selectedUserId,
      content: text,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      const savedMessage = await res.json();

      setMessages((prev) => [...prev, savedMessage]);

      socket.emit("send_message", savedMessage);

      socket.emit("stop_typing", {
        senderId: currentUserId,
        receiverId: selectedUserId,
      });

      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  // ================= AUTO SCROLL =================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* HEADER */}
      <div className="flex items-center gap-4 px-4 sm:px-6 md:px-8 py-4 bg-black/80 backdrop-blur-xl border-b border-yellow-500/20 shadow-lg z-10">
        <Link
          to="/inbox"
          className="text-2xl sm:text-3xl text-yellow-400 hover:text-yellow-300 hover:scale-110 transition-all duration-300"
        >
          ←
        </Link>

        <img
          src={getImageUrl(selectedUser?.profileImage)}
          alt={selectedUser?.name}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-yellow-400 object-cover"
        />

        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {selectedUser?.name || "User"}
          </h2>
          {typing && (
            <p className="text-xs sm:text-sm text-yellow-300 animate-pulse">
              ✍️ typing...
            </p>
          )}
        </div>

        <Link
          to={`/viewprofile/${selectedUserId}`}
          className="text-yellow-400 hover:text-yellow-300 transition-colors text-2xl"
          title="View Profile"
        >
          👤
        </Link>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 flex flex-col">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-400 text-lg">Start a conversation!</p>
              <p className="text-gray-500 text-sm mt-2">
                Send a message to begin
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            } animate-fadeIn`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div
              className={`group max-w-[70%] sm:max-w-[60%] px-4 sm:px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg ${
                msg.senderId === currentUserId
                  ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:shadow-xl hover:shadow-yellow-400/30"
                  : "bg-gradient-to-r from-slate-700 to-slate-800 text-gray-100 border border-slate-600 group-hover:border-yellow-400/50 hover:shadow-xl hover:shadow-slate-400/20"
              }`}
            >
              <p className="break-words text-sm sm:text-base">{msg.content}</p>
              <p
                className={`text-xs mt-2 ${
                  msg.senderId === currentUserId
                    ? "text-amber-700"
                    : "text-gray-400"
                }`}
              >
                {msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "just now"}
              </p>
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="flex gap-2 p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-xl border-t border-yellow-500/20 shadow-lg">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket.emit("typing", {
              senderId: currentUserId,
              receiverId: selectedUserId,
            });
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-slate-600 focus:border-yellow-400 transition-all duration-300"
        />

        <button
          onClick={handleSend}
          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex-shrink-0"
        >
          <span className="relative z-10 text-lg sm:text-xl">📤</span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        `}
      </style>
    </div>
  );
};

export default ChatBox;
