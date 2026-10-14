import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Navbar = ({ setToken }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#8e9ca8] shadow-sm">
      <div className="flex items-center justify-between px-6 sm:px-10 py-3 max-w-[1600px] mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-9 sm:h-10 w-auto object-contain" src={assets.logo} alt="Trendify" />
        </Link>
        <button
          onClick={() => setToken("")}
          className="px-6 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#1a2332] hover:bg-[#0f172a] rounded-full transition-all duration-200 shadow-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
