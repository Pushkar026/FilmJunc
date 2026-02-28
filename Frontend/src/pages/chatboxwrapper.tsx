import React from "react";
import { useParams } from "react-router-dom";
import ChatBox from "./chatbox";

const ChatBoxWrapper: React.FC = () => {
  const { selectedUserId } = useParams<{ selectedUserId: string }>();

  const userString = localStorage.getItem("user");
  const currentUserId = userString ? JSON.parse(userString)._id : "";

  if (!selectedUserId) return <div>Select a user to chat with</div>;
  if (!currentUserId) return <div>Please log in</div>;

  return (
    <ChatBox currentUserId={currentUserId} selectedUserId={selectedUserId} />
  );
};

export default ChatBoxWrapper;
