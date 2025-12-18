import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./context/ContextProvider";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3002/login", {
        email,
        password,
      });

      

      if (res.data?.user && res.data?.token) {
        // ✅ Store Supabase access token
        localStorage.setItem("token", res.data.token);

        // ✅ Store user in context
        login(res.data.user);

        // ✅ Redirect
        navigate("/notepad");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-neutral-800 p-6 rounded w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 rounded-2xl font-semibold text-white">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              className="w-full text-white border border-gray-300 px-3 py-2
                         focus:outline-none rounded-2xl focus:ring-2 focus:ring-neutral-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1 text-white font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              className="w-full border text-white border-gray-300 rounded-2xl px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-neutral-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-800 border rounded text-white py-2
                       font-semibold hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">Don’t have an account?</p>

        <Link
          to="/register"
          className="block w-full text-center rounded-2xl border mt-2 bg-neutral-800 text-white
                     py-2 font-semibold hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition no-underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;