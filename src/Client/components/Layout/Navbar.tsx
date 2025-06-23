import React from "react";

type NavbarProps = {
  collapsed: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ collapsed }) => {
  return (
    <nav
      className={`fixed top-0 ${
        collapsed ? "left-[4rem]" : "left-[16rem]"
      } right-0 h-[4rem] bg-gray-800 text-white flex items-center px-[1.5rem] shadow-md z-10 transition-all duration-300`}
    >
      <h1 className="text-xl font-semibold">My Navbar</h1>
    </nav>
  );
};

export default Navbar;
