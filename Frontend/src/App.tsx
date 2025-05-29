import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import "./App.css";
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserProfile from "./pages/userprofile";
import EditProfile from "./pages/editprofile";
import SearchResult from "./pages/searchresult";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/searchresult" element={<SearchResult />} />
      </Routes>
    </Router>
  );
}

export default App;
