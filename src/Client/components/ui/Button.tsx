'use client'

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  categories?:'Large' | 'Medium';
  color?: 'Green' | 'Red' | 'Blue';
};

const Button: React.FC<ButtonProps> = ({ children,categories='Large',color='Green', ...props }) => {

    const BaseColor = {
        Green : 'bg-green-500 hover:bg-green-700',
        Red : 'bg-red-500 hover:bg-red-700',
        Blue : 'bg-blue-500 hover:bg-blue-700',
    } [color] ?? 'bg-green-500 hover:bg-green-700'

    const BaseCategory = {
        Large : 'px-4 py-2 font-bold w-full',
        Medium : 'px-4 py-1.5 text-sm font-medium '
    }[categories] ?? 'px-4 py-2 font-bold'


    return (
        <button
            className={`${BaseColor} text-center text-white rounded ${BaseCategory} transition`}
            {...props}
        >
            {children}
        </button>
    );
};


export default Button;
