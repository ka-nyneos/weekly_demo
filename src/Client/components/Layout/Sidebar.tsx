"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  BarChart2,
  FileText,
  Building,
  Layers,
  Upload,
  FilePlus,
  CheckCircle,
  LogOut,
  Wrench,
  Settings,
  Bolt,
  UserPlus,
  HandCoins,
  ChevronDown,
  UserRoundCog,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

type SidebarProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
};

type NavItem = {
  label: string;
  path?: string;
  icon: React.ReactNode;
  subItems?: NavItem[];
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<Set<string>>(new Set());

  const navItems: NavItem[] = [
    { label: "Entity", path: "/entity", icon: <Building /> },
    { label: "Entity hierarchy", path: "/hierarchical", icon: <Layers /> },
    {
      label: "Configuration",
      icon: <Wrench />,
      subItems: [{ label: "Masters", path: "/masters", icon: <Bolt /> }],
    },
    {
      label: "Settings",
      icon: <Settings />,
      subItems: [
        { label: "Roles", path: "/roles", icon: <UserRoundCog /> },
        { label: "Permissions", path: "/permissions", icon: <HandCoins /> },
        { label: "Users", path: "/user-creation", icon: <UserPlus /> },
      ],
    },
    { label: "Exposure Upload", path: "/exposure-upload", icon: <Upload /> },
    { label: "Exposure Bucketing", path: "/exposure-bucketing", icon: <BarChart2 /> },
    { label: "Hedging Proposal", path: "/hedging-proposal", icon: <FileText /> },
    { label: "Hedging Dashboard", path: "/hedging-dashboard", icon: <LayoutDashboard /> },
    { label: "FX Booking", path: "/fxbooking", icon: <FilePlus /> },
    { label: "FX Status", path: "/FxStatusDash", icon: <CheckCircle /> },
    // { label: "FX Status", path: "/fxstatus", icon: <CheckCircle /> },
    { label: "Logout", path: "/", icon: <LogOut /> },
  ];

  useEffect(() => {
    const newOpenSubMenus = new Set<string>();
    navItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(
          (subItem) => subItem.path === location.pathname
        );
        if (hasActiveChild) {
          newOpenSubMenus.add(item.label);
        }
      }
    });
    setOpenSubMenus(newOpenSubMenus);
  }, [location.pathname]);

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus((prev) => {
      const newSet = new Set(prev);
      newSet.has(label) ? newSet.delete(label) : newSet.add(label);
      return newSet;
    });
  };

  const handleItemClick = (item: NavItem) => {
    if (item.subItems) {
      toggleSubMenu(item.label);
      if (!item.path) return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const isItemOrSubItemActive = (item: NavItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some(
        (subItem) => subItem.path && location.pathname === subItem.path
      );
    }
    return false;
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-50 ${
        collapsed ? "w-[4.5rem]" : "w-[17rem]"
      } bg-gray-700 text-white p-4 shadow-lg flex flex-col transition-all duration-500 overflow-x-visible`}
    >
      <button
        onClick={toggleCollapse}
        className="cursor-pointer text-white mb-6 self-end focus:outline-none hover:bg-green-300 rounded p-1"
      >
        {collapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      <nav className="flex flex-col space-y-2 w-full">
        {navItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isSubMenuOpen = openSubMenus.has(item.label);
          const isActive = isItemOrSubItemActive(item);

          return (
            <div key={item.label} className="relative w-full">
              <button
                onClick={() => handleItemClick(item)}
                className={`flex items-center rounded px-3 py-2.5 transition-colors w-full text-medium ${
                  isActive
                    ? "bg-green-500 font-medium"
                    : "hover:bg-green-400 font-medium"
                }`}
              >
                {/* Icon with Tooltip Logic */}
                <span className="w-6 flex justify-center group relative">
                  {item.icon}

                  {/* Tooltip only on icon hover in collapsed mode */}
                  {collapsed && !isActive && (
                    <div className="absolute left-[105%] top-1/2 -translate-y-1/2 z-50 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="whitespace-nowrap rounded bg-green-400 px-3 py-1.5 text-sm font-medium text-black shadow-lg">
                        {item.label}
                      </div>
                    </div>
                  )}
                </span>

                {/* Label and chevron for expanded mode */}
                {!collapsed && (
                  <>
                    <span className="ml-3 whitespace-nowrap flex-1 text-left">
                      {item.label}
                    </span>
                    {hasSubItems && (
                      <span className="w-4">
                        {isSubMenuOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Subitems - shown only when expanded */}
              {!collapsed && hasSubItems && isSubMenuOpen && (
                <div className="ml-8 mt-1.5 space-y-1.5">
                  {item.subItems?.map((subItem) => (
                    <button
                      key={subItem.label}
                      onClick={() => {
                        if (subItem.path) navigate(subItem.path);
                      }}
                      className={`flex items-center rounded px-3 py-2 transition-colors w-full ${
                        location.pathname === subItem.path
                          ? "bg-green-600 font-medium"
                          : "hover:bg-green-500 font-medium"
                      }`}
                    >
                      <span className="w-6 flex justify-center">{subItem.icon}</span>
                      <span className="ml-3 whitespace-nowrap text-left text-sm">
                        {subItem.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
