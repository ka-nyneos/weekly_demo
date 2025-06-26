import React from "react";
import { useState, useEffect } from "react";
type NavbarProps = {
  collapsed: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ collapsed }) => {
  const [sidebarLogo, setSidebarLogo] = useState<string | null>(null);
  const [sidebarTitle, setSidebarTitle] = useState<string | null>(null);
  useEffect(() => {
      const syncLogo = () => {
        const logo = localStorage.getItem("sidebarLogo");
        setSidebarLogo(logo);
      };
  
      syncLogo();
      window.addEventListener("logoUpdated", syncLogo);
      return () => window.removeEventListener("logoUpdated", syncLogo);
    }, []);
  
    
    useEffect(() => {
      const syncTitle = () => {
        const title = localStorage.getItem('sidebarTitle');
        setSidebarTitle(title);
      };
  
      syncTitle();
      window.addEventListener("titleUpdated", syncTitle);
      return () => window.removeEventListener("titleUpdated", syncTitle);
    }, []);
  return (
    <nav
      className={`fixed top-0 ${
        collapsed ? "left-[4rem]" : "left-[16rem]"
      } right-0 h-[4rem] bg-gray-800 text-white flex items-center px-[1.5rem] shadow-md z-10 transition-all duration-500`}
    >
      <div className="flex items-center justify-center h-32 w-30 bg-white bg-opacity-10 rounded-md transition-all duration-300 hover:bg-opacity-20">
  <img 
    src={sidebarLogo} 
    alt="Company Logo" 
    className="h-14 w-20 object-contain" 
  />
</div>
      <h1 className="text-xl font-semibold ml-4"></h1>
      <h1 className="text-xl font-semibold">
        {sidebarTitle}
      </h1>
    </nav>
  );
};

export default Navbar;
