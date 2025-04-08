const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 text-white p-4">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Welcome to <span className="text-yellow-400">FilmJunc 🎬</span>
      </h1>
      <p className="text-lg text-gray-300 text-center max-w-md">
        Connect with filmmakers, writers, editors, and other creators around
        you. Start collaborating and creating today.
      </p>

      <div className="mt-8 flex space-x-4">
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-white font-semibold transition"
        >
          Login
        </a>
        <a
          href="/signup"
          className="bg-gray-100 hover:bg-white text-gray-800 px-6 py-2 rounded-xl font-semibold transition"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default Home;
