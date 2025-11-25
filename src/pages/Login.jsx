import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const auth = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await auth.login(username, password);

    if (res.ok) nav("/");
    else setError(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-10 border border-gray-200">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-100 rounded-xl">
            <ClipboardList className="w-8 h-8 text-blue-700" />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center text-black">Operations Portal</h2>
        <p className="text-gray-500 text-center mb-8">
          Sign in to access the internal dashboard
        </p>

        <form onSubmit={submit} className="space-y-5">

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Username</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-black"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition"
          >
            Sign In
          </button>

          <div className="text-sm text-gray-500 text-center">
            Try users: agent1 / manager1 / admin (password: pass)
          </div>

        </form>
      </div>
    </div>
  );
}
