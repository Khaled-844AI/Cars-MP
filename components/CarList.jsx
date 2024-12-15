'use client'
import React, { useEffect, useState } from 'react';
import CarCard from './CarCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {supabase} from '../lib/initSupabase'


function CarList() {
  const [carList, setCarList] = useState([]);
  const [fetched, setFetched] = useState(false);


  useEffect(() => {
    if (!fetched) {
      getPopularCarList();
      setFetched(true);
    }
  }, []);

  const getPopularCarList = async () => {
        const { data, error } = await supabase
      .from('CarListing')
      .select('*,CarImages(*)')

      console.log(data,error)
      setCarList(data)
  };

  return (
    <div className='mx-4 md:mx-24'>
      <h2 className='font-bold text-[30px] text-center text-lg my-16'>Most Searched Cars</h2>
      <Carousel>
        <CarouselContent>
          {carList.map((car, index) => (
            <CarouselItem className='basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/3' key={index}>
              <CarCard car={car} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default CarList;
