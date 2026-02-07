import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../config";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: Date;
}

interface ChatBoxProps {
  currentUserId: string;
  selectedUserId: string;
}

const FullPageChat: React.FC<ChatBoxProps> = ({
  currentUserId,
  selectedUserId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch messages
  useEffect(() => {
    if (!selectedUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/messages?user1=${currentUserId}&user2=${selectedUserId}`
        );
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data: Message[] = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [currentUserId, selectedUserId]);

  // Send message
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

      if (!res.ok) throw new Error("Failed to send message");
      const savedMessage: Message = await res.json();

      setMessages((prev) => [...prev, savedMessage]);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Error sending message");
    }
  };

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black via-red-950 to-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-black bg-opacity-70 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-extrabold text-yellow-400 cursor-pointer">
          🎬 FilmJunc Chat
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length ? (
          messages.map((msg, idx) => (
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
          ))
        ) : (
          <p className="text-gray-400 text-center mt-4">No messages yet.</p>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="bg-black bg-opacity-70 backdrop-blur-md p-4 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-l-lg bg-gray-900 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 "
        />
        <button
          onClick={handleSend}
          className="bg-yellow-400 text-black px-6 py-2 rounded-r-full font-bold hover:bg-yellow-300 transition"
        >
          Send 🎟️
        </button>
      </div>
    </div>
  );
};

export default FullPageChat;
