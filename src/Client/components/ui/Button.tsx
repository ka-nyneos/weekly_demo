'use client'

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
