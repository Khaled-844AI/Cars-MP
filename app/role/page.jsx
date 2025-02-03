'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { IoIosArrowBack } from "react-icons/io";


import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

function Page() {
  const { user } = useUser();
  const [api, setApi] = useState(null); 
  const [current, setCurrent] = useState(0); 

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const goToPrevious = () => {
    if (api) {
      api.scrollTo(current - 1); 
    }
  };

  const HandleUser = async (isBuyer , isDealer)=>{
      await fetch('/api/UpdateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id , isBuyer : isBuyer, isDealer: isDealer}),
      });
      redirect('/');
  }


  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <h2 className="font-bold text-3xl text-gray-700 p-7 mb-10">Complete Sign up</h2>

      <Carousel
        className="flex flex-col w-[40%] h-[60%] rounded-3xl bg-slate-300 "
        setApi={setApi}
      >
        <CarouselContent>
          <CarouselItem className='mt-10'>
            <div className="flex flex-col items-center justify-evenly gap-8">
                <h3 className="font-bold text-3xl text-gray-500 p-5">Which User are you?</h3>

                <Button
                  onClick={()=>{HandleUser(true,false)}}
                  className="w-[25%] h-[30%] text-xl rounded-lg bg-black"
                >
                  Buyer
                </Button>

                <Button
                  onClick={()=>{HandleUser(false,true)}}
                  className="w-[25%] h-[30%] text-xl rounded-lg bg-black"
                >
                  Car Dealer
                </Button>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className='mb-10'>
              <Button onClick={goToPrevious} className='p-3 m-5 rounded-full'><IoIosArrowBack/></Button>
            </div>  
            <div className="flex flex-col items-center justify-evenly">
                
                <h3 className="font-bold text-3xl text-gray-500">Complete the Dealer Form</h3>
            </div>
            
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default Page;
