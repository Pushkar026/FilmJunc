import React, { useState, useEffect, useRef } from "react";

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

const ChatBox: React.FC<ChatBoxProps> = ({ currentUserId, selectedUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages?user1=${currentUserId}&user2=${selectedUserId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch messages bro");
        }
        const data: Message[] = await res.json();
        setMessages(data);
      } catch (error) {
        console.error(error);
        setMessages([]);
      }
      console.log("currentUserId:", currentUserId);
      console.log("selectedUserId:", selectedUserId);
    };

    fetchMessages();
  }, [selectedUserId, currentUserId]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const newMessage = {
      senderId: currentUserId,
      receiverId: selectedUserId,
      content: text,
    };

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) {
        throw new Error("Failed to send message bro");
      }

      const savedMessage: Message = await res.json();

      setMessages((prev) => [...prev, savedMessage]);
      setText("");
    } catch (error) {
      console.error(error);
      alert("Error sending message. Please try again.");
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-[400px] border rounded-lg flex flex-col p-4 bg-white shadow">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md max-w-[60%] ${
              msg.senderId === currentUserId
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatRef} />
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 border rounded-l px-3 py-2"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
