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
    <div className="flex flex-col h-screen bg-gradient-to-b from-black via-red-950 to-black text-white">
      {/* HEADER */}
      <div className="flex items-center gap-4 px-6 py-3 bg-black border-b border-gray-800 shadow-md">
        <Link to="/inbox" className="text-yellow-400 text-xl">
          ←
        </Link>

        <img
          src={getImageUrl(selectedUser?.profileImage)}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />

        <span className="font-semibold">{selectedUser?.name || "User"}</span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[60%] p-3 rounded-lg ${
              msg.senderId === currentUserId
                ? "bg-yellow-400 text-black self-end ml-auto"
                : "bg-gray-800 text-white self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* TYPING */}
      {typing && (
        <div className="px-6 text-sm text-gray-400">
          {selectedUser?.name} is typing...
        </div>
      )}

      {/* INPUT */}
      <div className="flex gap-2 p-4 bg-black border-t border-gray-800">
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
          className="flex-1 px-4 py-3 rounded-lg bg-gray-900 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          onClick={handleSend}
          className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
