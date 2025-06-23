"use client";

import React from "react";
import Button from "../ui/Button";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
};
const Layout: React.FC<{ children: React.ReactNode } & LayoutProps> = ({
  children,
  title,
  showButton = false,
  buttonText = "Click Me",
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col h-screen ">
      <nav className="h-16 bg-gray-800 text-white flex items-center px-6 shadow-md">
        <h1 className="text-xl font-semibold">My Navbar</h1>
      </nav>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-700 text-white p-4"></aside>

        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-md p-6 h-full w-full">
            <div className="border-b pb-4 mb-10">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-black-700">{title}</h1>
                {showButton && (
                  <Button onClick={onButtonClick}>
                    <span className="text-white">{buttonText}</span>
                  </Button>
                )}
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
