'use client'
import React from 'react';
import { BiSolidHomeAlt2 } from "react-icons/bi";
import { Button } from './ui/button';

function HomeButton({ id, isActive, onClick }) {
  return (
    <Button
      onClick={() => onClick(id)}
      className={`w-[70%] rounded-2xl h-[12%] flex flex-col items-center justify-center ${
        isActive
          ? 'bg-white text-black shadow-lg shadow-white hover:bg-white'
          : 'bg-black text-white hover:bg-gray-700 hover:text-black'
      }`}
    >
      <BiSolidHomeAlt2
        className={`${isActive ? 'text-black animate-pulse' : ''}`}
      />
      <div className={`${isActive ? 'animate-pulse' : ''}`}>Home</div>
    </Button>
  );
}

export default HomeButton;
