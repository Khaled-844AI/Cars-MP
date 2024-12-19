'use client'
import React from 'react';
import data from '@/data/data';
import Link from 'next/link';



function Category() {
  return (
    <div className='mt-40'>
      <h2 className='font-bold text-3xl text-center mb-6'>Categories</h2>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-6 px-4 sm:px-20'>
        {data.Category.map((item, index) => (
          <Link key={index} href={'/category/'+item.type}>
          <div 
            key={index} 
            className='border-2 bg-gray-200 hover:bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200 border-solid border-gray rounded-xl p-2 flex flex-col items-center shadow-lg mb-5
            hover:scale-110 transition-transform duration-200 cursor-pointer hover:text-primary'
          >
            <img 
              src={item.icon} 
              width={40} 
              height={40} 
              alt={`Icon for ${item.type}`} 
              className="mb-2"
            />
            <h2 className='text-lg font-semibold text-center'>{item.type}</h2>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Category;
