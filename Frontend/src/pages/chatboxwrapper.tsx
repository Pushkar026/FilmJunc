// ChatBoxWrapper.tsx

import React from "react";
import { useParams } from "react-router-dom";
import ChatBox from "./chatbox"; // Adjust path as needed

const ChatBoxWrapper: React.FC = () => {
  const { selectedUserId } = useParams<{ selectedUserId: string }>();
  const currentUserId = localStorage.getItem("userId") || "";

  if (!selectedUserId) return <div>Select a user to chat with</div>;

  return (
    <ChatBox currentUserId={currentUserId} selectedUserId={selectedUserId} />
  );
};

export default ChatBoxWrapper;
