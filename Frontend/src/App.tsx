import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "./socket";

import Home from "./pages/home";
import "./App.css";
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserProfile from "./pages/userprofile";
import EditProfile from "./pages/editprofile";
import SearchResult from "./pages/searchresult";
import ViewProfile from "./pages/viewprofile";
import ChatBoxWrapper from "./pages/chatboxwrapper";
import InboxWrapper from "./pages/inobxwrapper";
import Collaborators from "./pages/collaborators";

function App() {
  useEffect(() => {
    // connect socket once when app loads
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/searchresult" element={<SearchResult />} />
        <Route path="/viewprofile/:id" element={<ViewProfile />} />
        <Route path="/chatbox/:selectedUserId" element={<ChatBoxWrapper />} />
        <Route path="/inbox" element={<InboxWrapper />} />
        <Route path="/collaborators" element={<Collaborators />} />
      </Routes>
    </Router>
  );
}

export default App;
