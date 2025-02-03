'use client'
import { Separator } from "@/components/ui/separator";
import { IoMdSpeedometer } from "react-icons/io";
import { FaGears } from "react-icons/fa6";
import { BsFuelPump } from "react-icons/bs";
import React from "react";
import { useState } from "react";
import Link from "next/link";

function CarCard({ car }) {
  const [isEnlarged, setIsEnlarged] = useState(false);

  const toggleImageSize = () => {
    setIsEnlarged(prev => !prev);
  };


  return (
    <div className="rounded-xl bg-gray-200 border hover:shadow-xl overflow-hidden max-w-sm mx-auto h-[400px]">
      {car.condition === 'new' ? 
      <h2 className="absolute m-2 bg-green-500 px-2 rounded-full text-sm pb-1 text-white">{car.condition}</h2>
      : car?.condition === 'used' ? <h2 className="absolute m-2 bg-blue-500 px-2 rounded-full text-sm pb-1 text-white">{car.condition}</h2>
      :null}
      <img 
        src={car?.CarImages[0]?.imageUrl} 
        alt={`${car?.model}`} 
        className={`w-full h-[200px] object-cover rounded-t-2xl transition-transform duration-300 ${isEnlarged ? 'scale-110' : ''}`} 
        onClick={toggleImageSize}
      />
      <div className='p-4'>
        <h2 className='font-bold text-black text-center text-lg mb-2'>{car?.model}</h2>
        <Separator className='bg-gray-400'/>
        <div className='grid grid-cols-3 gap-4 mt-5 sm:grid-cols-2 md:grid-cols-3'>
          <div className='flex flex-col items-center'>
            <BsFuelPump className='text-lg mb-2' />
            <h2 className="text-center text-sm md:text-base whitespace-nowrap">{car?.mileage} Miles</h2>
          </div>
          <div className='flex flex-col items-center'>
            <IoMdSpeedometer className='text-lg mb-2' />
            <h2 className="text-center text-sm md:text-base">{car?.fuel_type}</h2>
          </div>
          <div className='flex flex-col items-center'>
            <FaGears className='text-lg mb-2' />
            <h2 className="text-center text-sm md:text-base">{car?.gear_type}</h2>
          </div>
        </div>
        <Separator className='my-2 bg-gray-400' />
        <div className="flex items-center justify-between">
          <h2 className='font-bold text-xl'>Price: <span className="text-green-600">{car?.price}$</span></h2>
                <Link href={'/car/?id=' + car.id}>
                  <h2 className="text-blue-400 text-sm cursor-pointer">View details</h2>
                </Link>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
