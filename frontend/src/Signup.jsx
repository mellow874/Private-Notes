import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3002/register", { name, email, password })
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((err) => console.log(err.response?.data || err));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-neutral-800 p-6 rounded w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-white">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              className="w-full border border-gray-300 px-3 text-white py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="mb-4 text-white">
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="text"
              placeholder="Enter Email"
              autoComplete="off"
              className="w-full border border-gray-300 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4 text-white">
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              className="w-full border border-gray-300 text-white px-3 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-800 border-gray-300 border rounded-3xl text-white py-2 font-semibold hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4">Already have an account?</p>

        <Link
            to="/login"
            className="block text-center mt-2 border border-gray-300 rounded-2xl bg-neutral-800 py-2
             text-gray-800 no-underline hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] hover:text-black transition"
            >
            Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;