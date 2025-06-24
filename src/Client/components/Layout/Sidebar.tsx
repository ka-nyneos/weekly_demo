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


// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Menu,
//   X,
//   BarChart2,
//   FileText,
//   Building,
//   Layers,
//   Upload,
//   FilePlus,
//   CheckCircle,
//   LogOut,
// } from "lucide-react";

// interface SidebarProps {
//   collapsed: boolean;
//   setCollapsed: (collapsed: boolean) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navItems = [
//     { label: "Entity", path: "/entity", icon: <Building /> },
//     { label: "Entity hierarchy", path: "/hierarchical", icon: <Layers /> },
//     { label: "Exposure Upload", path: "/exposure-upload", icon: <Upload /> },
//     { label: "Exposure Bucketing", path: "/exposure-bucketing", icon: <BarChart2 /> },
//     { label: "Hedging Proposal", path: "/hedging-proposal", icon: <FileText /> },
//     { label: "FX Booking", path: "/fxbooking", icon: <FilePlus /> },
//     { label: "FX Status", path: "/fx-status", icon: <CheckCircle /> },
//     { label: "Logout", path: "/", icon: <LogOut /> },
//   ];

//   return (
//     <div
//       className={[
//         "h-screen z-50 bg-green-200 text-green-900 shadow-md transition-all duration-300 ease-in-out flex flex-col items-center fixed top-0 left-0 rounded-lg m-2",
//         collapsed ? "w-16" : "w-60",
//       ].join(" ")}
//     >
//       <button
//         onClick={() => setCollapsed(!collapsed)}
//         className="self-end m-4 p-1 hover:bg-green-300 rounded"
//       >
//         {collapsed ? <Menu size={24} /> : <X size={24} />}
//       </button>

//       {!collapsed && <h2 className="text-2xl font-bold mb-6">CashInvoice</h2>}

//       <nav className="flex flex-col space-y-2 w-full px-2">
//         {navItems.map(({ label, path, icon }) => {
//           const isActive = location.pathname === path;
//           return (
//             <button
//               key={label}
//               onClick={() => navigate(path)}
//               className={`flex items-center space-x-2 px-3 py-2 rounded w-full transition-colors ${
//                 isActive ? "bg-green-400 font-semibold" : "hover:bg-green-300"
//               }`}
//             >
//               {icon}
//               {!collapsed && <span>{label}</span>}
//             </button>
//           );
//         })}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
