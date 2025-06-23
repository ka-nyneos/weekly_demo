"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SidebarProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleCollapse }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen ${
        collapsed ? "w-[4rem]" : "w-[16rem]"
      } bg-gray-700 text-white p-[1rem] shadow-lg flex flex-col transition-all duration-300 z-20`}
    >
      <button
        onClick={toggleCollapse}
        className="cursor-pointer text-white mb-[1.5rem] self-end focus:outline-none"
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <ul
        className={`space-y-[1rem] text-sm transition-opacity duration-300 ${
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <li><a href="#" className="hover:text-gray-300">Dashboard</a></li>
        <li><a href="#" className="hover:text-gray-300">Messages</a></li>
        <li><a href="#" className="hover:text-gray-300">Settings</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
