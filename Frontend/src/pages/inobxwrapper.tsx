import React from "react";
import Inbox from "./inbox"; // Adjust import to match your folder structure

const InboxWrapper: React.FC = () => {
  const currentUserId = localStorage.getItem("userId") || "";

  if (!currentUserId) {
    return (
      <div className="p-4 text-center">Please log in to see your inbox.</div>
    );
  }

  return <Inbox currentUserId={currentUserId} />;
};

export default InboxWrapper;
