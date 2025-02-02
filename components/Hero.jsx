import React from 'react';
import Search from './Search';
import Header from './Header';

function Hero() {
  return (
    
    <div 
      className='flex flex-col items-center p-10 py-10 gap-10 h-[530px] w-full'
      style={{
        backgroundImage: "linear-gradient(rgba(0.5, 100, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/bawp-17-media-portrait__1_-removebg-preview.png')",
        backgroundColor: 'transparent',
        backgroundSize: 'contain', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
      }}
    >
      
      <h2 
        className="max-w-[50rem] mb-28 sm:max-w-[49rem]mb-20 px-3 md:px-0 sm:text-5xl md:text-7xl text-4xl font-bold font-display md:leading-[1.1em] text-center inline-block text-transparent bg-gradient-to-br from-cyan-900 via-cyan-700 to-cyan-300 bg-clip-text"
      >
        Find Your Dream Car
      </h2>

      <Search />
      <img src="/porsh.png" className='w-[67%] object-contain' alt="Porsche Car" />
      </div>
    
  );
}

export default Hero;