import React from 'react'
import Search from './Search'

function Hero() {
  return (
    <div className='no-scrollbar'>
        <div className='flex flex-col items-center p-10 py-20 gap-6 h-[570px] w-full bg-[#eae7e6]'>
            <h2 className='text-[60px] font-bold'>Find Your Dream Car</h2>
            <Search/>

            <img src="/porsh.png" className='w-[67%] mt-20 slide-in'/>
        </div>
    </div>
  )
}

export default Hero