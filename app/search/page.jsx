'use client'

import React, { Suspense, useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useSearchParams, useParams} from 'next/navigation';
import CarCard from '../../components/CarCard';
import { supabase } from '../../lib/initSupabase';
import Searching from '../../components/Searching';
import Search from '../../components/Search';

function FillterCar() {
  const [carsQuery, setCarsQuery] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading , setLoading] = useState(true);
  const searchParams = useSearchParams();
  const {type} = useParams();

  const mode = searchParams.get('mode');


  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minMiles, setMinMiles] = useState('');
  const [maxMiles, setMaxMiles] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if(mode === 'search') {
        const CarName = searchParams.get('name');
        const Carcategory = searchParams.get('category');
        const Carcondition = searchParams.get('condition');

        try {
          let query = supabase.from('CarListing').select('*, CarImages(*)');

          if (CarName !== '') {
            query = query.eq('listing_title', CarName);
          }
          if (Carcategory) {
            query = query.eq('category', Carcategory);
          }
          if (Carcondition) {
            query = query.eq('condition', Carcondition.toLowerCase());
          }

          const { data, error } = await query;

          if (error) throw error;
          setCarsQuery(data);
        } catch (error) {
          console.error('Error searching the data:', error);
        }
      } else {
        try {
          const { data, error } = await supabase
            .from('CarListing')
            .select('*, CarImages(*)')
            .eq('category', type);

          if (error) throw error;
          setCarsQuery(data);
        } catch (error) {
          console.error('Error fetching cars:', error);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [type, mode, searchParams]);

  useEffect(() => {
    const applyFilters = () => {
      setFilteredCars(
        carsQuery.filter(car => {
          const carPrice = car.price;
          const carMiles = car.mileage;

          const isPriceInRange =
            (!minPrice || carPrice >= parseFloat(minPrice)) &&
            (!maxPrice || carPrice <= parseFloat(maxPrice));
          const isMilesInRange =
            (!minMiles || carMiles >= parseFloat(minMiles)) &&
            (!maxMiles || carMiles <= parseFloat(maxMiles));

          return isPriceInRange && isMilesInRange;
        })
      );
    };

    applyFilters();
  }, [carsQuery, minPrice, maxPrice, minMiles, maxMiles]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <Searching/>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="container mx-auto">
        <div className="flex justify-center p-5 sm:p-10">
          <h2 className="font-bold text-xl sm:text-3xl text-blue-400">{type} Cars</h2>
        </div>

        <div className='flex justify-center'>
            <Search/>
        </div>

        {/* Filter inputs */}
        <div className="flex justify-center p-5 gap-6">
          <div>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border p-2 rounded"
              placeholder="Min Price"
            />
          </div>
          <div>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border p-2 rounded"
              placeholder="Max Price"
            />
          </div>
          <div>
            <input
              type="number"
              value={minMiles}
              onChange={(e) => setMinMiles(e.target.value)}
              className="border p-2 rounded"
              placeholder="Min Miles"
            />
          </div>
          <div>
            <input
              type="number"
              value={maxMiles}
              onChange={(e) => setMaxMiles(e.target.value)}
              className="border p-2 rounded"
              placeholder="Max Miles"
            />
          </div>
        </div>

        {filteredCars.length > 0 ? (
          <ul>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-8">
              {filteredCars.map((car, index) => (
                <div key={index} className="p-3">
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          </ul>
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-auto max-w-md font-semibold p-10 border bg-gray-200 rounded-lg">
              <p>Sorry, no cars available for this category.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default function fillterCar() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FillterCar />
    </Suspense>
  );
}
