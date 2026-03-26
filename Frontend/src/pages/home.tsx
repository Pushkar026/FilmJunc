// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./navbar";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);

    // 🔥 If user object missing, force logout
    if (!userString) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      return;
    }

    const user = JSON.parse(userString);

    // 🔥 Enforce onboarding
    if (!user.profileCompleted) {
      navigate("/editprofile", { replace: true });
    }
  }, [navigate]);

  const handleresult = () =>
    navigate(`/searchresult?location=${encodeURIComponent(searchTerm)}`);

  const icons = ["🎞️", "🎥", "🎤", "🍿"];
  const iconPositions = [
    { top: "10%", left: "5%" },
    { top: "25%", left: "80%" },
    { top: "60%", left: "20%" },
    { top: "75%", left: "70%" },
  ];

  return (
    <div className="w-full relative text-white overflow-hidden">
      {/* Show Navbar only if logged in */}
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}

      {/* Hero Section */}
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 pt-20 md:pt-0">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500 rounded-full opacity-15 blur-3xl animate-pulse-slow"></div>
          <div className="absolute -top-20 right-1/4 w-96 h-96 bg-red-600 rounded-full opacity-10 blur-3xl animate-pulse-slow delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full opacity-5 blur-3xl"></div>

          {/* Floating icons */}
          {icons.map((icon, idx) => (
            <span
              key={idx}
              className="absolute text-6xl md:text-7xl opacity-10 animate-float pointer-events-none"
              style={{
                top: iconPositions[idx].top,
                left: iconPositions[idx].left,
                animationDelay: `${idx * 1}s`,
              }}
            >
              {icon}
            </span>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 md:px-6 z-10">
          {/* Main Heading */}
          <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-tight animate-fadeIn">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                FilmJunc
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100 animate-fadeIn delay-200">
              Where <span className="text-yellow-400">Creators</span> Meet{" "}
              <span className="text-red-400">Stories</span>
            </p>
          </div>

          {/* Subheading - Show search for logged in users */}
          {isLoggedIn ? (
            <div className="w-full max-w-2xl mx-auto mb-12 animate-fadeIn delay-300">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
                🔍 Find Creators Near You
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="Enter your city or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleresult()}
                  className="flex-1 px-6 py-4 rounded-full bg-slate-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-slate-600 focus:border-yellow-400 transition-all duration-300 text-base"
                />
                <button
                  onClick={handleresult}
                  className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden whitespace-nowrap"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🚀 Search
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed animate-fadeIn delay-300">
              Connect with independent filmmakers, writers, actors, and
              cinematographers in your city.
              <br className="hidden sm:block" />
              <span className="text-yellow-300 font-semibold">
                Find your crew. Create together. Rise together.
              </span>
            </p>
          )}

          {/* CTA Buttons */}
          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 animate-fadeIn delay-400">
              <a
                href="/login"
                className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🎬 Login
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="/signup"
                className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  ✨ Join Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {/* What You Can Do Section */}
      <section className="relative w-full py-20 md:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-40 right-1/3 w-80 h-80 bg-yellow-500 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 z-10">
          {/* Section Title */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
              Why Choose FilmJunc?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-red-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Everything you need to find collaborators, build your network, and
              create amazing projects locally.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {/* Card 1 */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 overflow-hidden border border-slate-700 hover:border-yellow-500 transition-all duration-500 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  🔍
                </div>
                <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                  Discover Local Talent
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Find filmmakers, writers, actors, and cinematographers in your
                  city. Build connections that matter with creators nearby.
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 overflow-hidden border border-slate-700 hover:border-yellow-500 transition-all duration-500 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  👤
                </div>
                <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                  Showcase Your Skills
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Create a powerful portfolio that highlights your unique
                  talents. Stand out and get noticed by the right people.
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 overflow-hidden border border-slate-700 hover:border-yellow-500 transition-all duration-500 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  🎬
                </div>
                <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                  Create Together
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Collaborate on real projects, share ideas, and bring your
                  creative vision to life with your perfect crew.
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </div>

          {/* Secondary Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-red-500 transition-colors">
              <div className="text-4xl flex-shrink-0">💬</div>
              <div>
                <h4 className="text-xl font-bold text-yellow-400 mb-2">
                  Direct Messaging
                </h4>
                <p className="text-gray-300">
                  Connect instantly with creators you want to work with.
                  Real-time chat makes collaboration seamless.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-red-500 transition-colors">
              <div className="text-4xl flex-shrink-0">📍</div>
              <div>
                <h4 className="text-xl font-bold text-yellow-400 mb-2">
                  Location-Based Discovery
                </h4>
                <p className="text-gray-300">
                  Find talents near you. Perfect for local productions,
                  networking, and building your creative community.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-red-500 transition-colors">
              <div className="text-4xl flex-shrink-0">🤝</div>
              <div>
                <h4 className="text-xl font-bold text-yellow-400 mb-2">
                  Collaboration Requests
                </h4>
                <p className="text-gray-300">
                  Send and receive collaboration requests. Easily build teams
                  with people who share your vision.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-red-500 transition-colors">
              <div className="text-4xl flex-shrink-0">📱</div>
              <div>
                <h4 className="text-xl font-bold text-yellow-400 mb-2">
                  Mobile Friendly
                </h4>
                <p className="text-gray-300">
                  Access FilmJunc on any device. Stay connected with your team
                  whenever, wherever you are.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative w-full py-20 md:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-yellow-500 rounded-full opacity-5 blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 md:px-8 z-10">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            Your Story Deserves the Right Team
          </h2>

          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-red-500 mx-auto rounded-full mb-12"></div>

          {/* Main content */}
          <div className="space-y-6 md:space-y-8 text-center mb-12">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              FilmJunc is built on a simple belief:{" "}
              <span className="text-yellow-300 font-semibold">
                great stories come from great teams
              </span>
              . In today's world, incredible creative talent is scattered across
              cities, struggling to find each other.
            </p>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              We're changing that. FilmJunc connects independent filmmakers,
              writers, actors, cinematographers, sound designers, editors, and
              every other creative professional in your area. Whether you're
              working on a short film, a documentary, a web series, or building
              your portfolio, FilmJunc is your platform to find collaborators
              who get your vision.
            </p>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              It's not just about connections—it's about{" "}
              <span className="text-red-300 font-semibold">community</span>.
              Share your work, get feedback, discover new talents, and most
              importantly,{" "}
              <span className="text-yellow-300 font-semibold">
                create something amazing together
              </span>
              .
            </p>
          </div>

          {/* Stats / Key points */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-red-500/10 border border-yellow-500/20">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                🌍
              </div>
              <p className="text-gray-300 font-semibold">Local First</p>
              <p className="text-sm text-gray-400">Find creators nearby</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-red-500/10 border border-yellow-500/20">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                🎯
              </div>
              <p className="text-gray-300 font-semibold">Easy to Use</p>
              <p className="text-sm text-gray-400">
                Simple, intuitive platform
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-red-500/10 border border-yellow-500/20">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                🤝
              </div>
              <p className="text-gray-300 font-semibold">Made for Creators</p>
              <p className="text-sm text-gray-400">Built by creators</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-red-500/10 border border-yellow-500/20">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                📱
              </div>
              <p className="text-gray-300 font-semibold">Always Connected</p>
              <p className="text-sm text-gray-400">Mobile & web</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-16 md:py-24 bg-gradient-to-r from-slate-900 via-red-900/30 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-32 top-1/2 w-64 h-64 bg-yellow-500 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -right-32 top-1/2 w-64 h-64 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8 z-10">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
            Ready to Build Your Crew?
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of creative professionals connecting, collaborating,
            and creating amazing content together.
          </p>

          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="group relative px-10 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold text-lg rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                ✨ Join FilmJunc Today
              </a>
              <a
                href="/login"
                className="group relative px-10 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold text-lg rounded-full border-2 border-yellow-400 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                🎬 Login
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-gray-300 mt-10">
        {/* Thin golden line */}
        <div className="border-t border-yellow-500"></div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600">
            FilmJunc 🎬
          </div>

          {/* Made by */}
          <div className="mt-2 md:mt-0 text-gray-300 text-center md:text-left">
            Made by{" "}
            <a
              href="https://www.linkedin.com/in/pushkar-yadav-b654a0251"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold underline"
            >
              Pushkar Yadav
            </a>{" "}
            | 2026 © All rights reserved
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>
        {`
          @keyframes float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(15deg); } }
          .animate-float { animation: float 6s ease-in-out infinite; }

          @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-fadeIn { animation: fadeIn 1s ease forwards; }
          .animate-fadeIn.delay-200 { animation-delay: 0.2s; }
          .animate-fadeIn.delay-300 { animation-delay: 0.3s; }
          .animate-fadeIn.delay-400 { animation-delay: 0.4s; }

          @keyframes pulseSlow { 0%,100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.2); opacity: 0.4; } }
          .animate-pulse-slow { animation: pulseSlow 6s infinite; }
          .animate-pulse-slow.delay-1000 { animation-delay: 1s; }

          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          .animate-bounce { animation: bounce 2s infinite; }
        `}
      </style>
    </div>
  );
};

export default Home;
