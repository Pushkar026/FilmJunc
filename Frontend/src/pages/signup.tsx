import { useState } from "react";
const Signup = () => {
  //Creating usestate to save data of input fields
  const [formData, setformdata] = useState({
    Username: "",
    Email: "",
    Password: "",
  });

  //creating handlechange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //creating handlesubmit
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>

        <label className="block mb-4">
          <span className="text-gray-700">Username</span>
          <input
            type="text"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="Email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700">Password</span>
          <input
            type="Password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;
