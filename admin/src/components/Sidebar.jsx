import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-[#edf2f7] border-r border-slate-300 p-5 shrink-0">
      <div className="flex flex-col gap-3">
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 ${
              isActive
                ? "bg-[#d7ecf8] text-[#0f172a] border-2 border-slate-800 shadow-sm"
                : "bg-white/90 text-slate-700 border-2 border-slate-400 hover:bg-white"
            }`
          }
        >
          <div className="w-5 h-5 flex items-center justify-center rounded-full border border-current text-xs font-bold leading-none">
            +
          </div>
          <span>Add Items</span>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 ${
              isActive
                ? "bg-[#d7ecf8] text-[#0f172a] border-2 border-slate-800 shadow-sm"
                : "bg-white/90 text-slate-700 border-2 border-slate-400 hover:bg-white"
            }`
          }
        >
          <img className="w-5 h-5 object-contain" src={assets.parcel_icon} alt="List Items" />
          <span>List Items</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 ${
              isActive
                ? "bg-[#d7ecf8] text-[#0f172a] border-2 border-slate-800 shadow-sm"
                : "bg-white/90 text-slate-700 border-2 border-slate-400 hover:bg-white"
            }`
          }
        >
          <img className="w-5 h-5 object-contain" src={assets.order_icon} alt="View Orders" />
          <span>View Orders</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
