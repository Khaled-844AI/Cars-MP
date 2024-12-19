import React from 'react'
import Search from './Search'

function Hero() {
  return (
        <div className='flex flex-col items-center p-10 py-20 gap-6 h-[570px] w-full bg-[#eae7e6]'>
            <h2 
              className="max-w-[50rem] sm:max-w-[49rem] mb-10 px-3 md:px-0 sm:text-5xl md:text-7xl text-4xl font-bold font-display md:leading-[1.1em] text-center inline-block text-transparent bg-gradient-to-br from-cyan-900 via-cyan-700 to-cyan-300 bg-clip-text">
                Find Your  Dream Car
            </h2>

            <Search/>

            <img src="/porsh.png" className='w-[67%] mt-20 slide-in'/>
        </div>
  )
}

export default Hero