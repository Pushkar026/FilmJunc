import React, { useEffect, useState } from "react";
import Inbox from "./inbox";

const InboxWrapper: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUserId(user._id);
    }
  }, []);

  if (!currentUserId) {
    return (
      <div className="p-4 text-center">Please log in to see your inbox.</div>
    );
  }

  return <Inbox currentUserId={currentUserId} />;
};

export default InboxWrapper;
