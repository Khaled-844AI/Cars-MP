'use client'

import React, { useEffect, useState } from 'react';
import Header from './../../components/Header';
import CarCard from './../../components/CarCard'
import { supabase } from './../../lib/initSupabase';
import { Separator } from '../../components/ui/separator';
import Loader from '../../components/Loader';
import Search from './../../components/Search'

function FillterCar() {
  const [carsQuery, setCarsQuery] = useState([]);
  const [fetched , setFetched] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
        try {
          const { data, error } = await supabase
            .from('CarListing')
            .select('*, CarImages(*)');

          if (error) throw error;
          setCarsQuery(data);
        } catch (error) {
          console.error('Error fetching cars:', error);
        }
        setFetched(true);
    };

    if(!fetched) fetchData();
  }, []);

  return (
    <>
      <Header />

      <div className="container mx-auto">

              <div className="flex justify-center p-5 sm:p-10">
                <h2 className="font-bold text-xl sm:text-3xl text-blue-400"> Cars</h2>
              </div>

        {carsQuery.length > 0 ? (
        <>

              <Separator className='bg-gray-300 mb-10'/>

              <div className='flex justify-center'>
                  <Search/>
              </div>
        

        
          <ul>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-8">
              {carsQuery.map((car, index) => (
                <div key={index} className="p-3">
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          </ul>
          </>) : (
          <div className="flex justify-center items-center">
              {!fetched ? <Loader/> :
                <div className="w-auto max-w-md font-semibold p-10 border bg-gray-200 rounded-lg">
                  <p>Sorry, no cars available for this category.</p>
                </div>   
              }
          </div>
        )}
      </div>
    </>
  );
}

export default FillterCar;
