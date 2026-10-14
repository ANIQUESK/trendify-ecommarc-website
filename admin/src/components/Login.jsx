import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#f1f5f9] px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl border-2 border-slate-300 shadow-sm">
        <div className="mb-4 flex justify-center">
          <img className="h-10 w-auto object-contain" src={assets.logo} alt="Trendify" />
        </div>
        <h1 className="mb-1 text-xl font-bold text-center text-slate-800">Admin Dashboard</h1>
        <p className="mb-6 text-xs text-center text-slate-500">Sign in with your admin credentials to manage Trendify</p>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-bold text-slate-700">Admin Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-3.5 py-2.5 text-sm border-2 border-slate-400 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 bg-white"
              type="email"
              placeholder="admin@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-bold text-slate-700">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-3.5 py-2.5 text-sm border-2 border-slate-400 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 bg-white"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            className="w-full py-2.5 mt-2 text-sm font-semibold text-white bg-[#233142] hover:bg-[#16202c] active:scale-95 rounded-lg transition-all duration-150 shadow-sm cursor-pointer"
            type="submit"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
