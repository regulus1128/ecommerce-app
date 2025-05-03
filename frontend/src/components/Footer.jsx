import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

function Footer() {
  return (
    <div>
        <div className='flex flex-col justify-around sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40'>
            <div>
                <img src={assets.logo4} className='mb-6 w-32' alt="" />
                <p className='w-full md:w-2/3 lato-regular'>
                Bringing you the latest in comfort, quality, and trendsetting footwear. From everyday essentials to standout statement pieces — walk your journey with SoleVibe.
                </p>
            </div>
            
            <div>
              <p className='text-xl font-medium mb-6'>GET IN TOUCH</p>
              <ul className='flex flex-col gap-1'>
                <li className='lato-regular'>+91-7784588783</li>
                <li className='lato-regular'>contact@solevibe.com</li>
              </ul>
            </div>
        </div>
        <div>
          <hr className='bg-gray-600'/>
          <p className='py-6 text-sm text-center'>Copyright 2025 @ solevibe.com - All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer