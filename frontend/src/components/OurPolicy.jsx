import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-14 sm:gap-2 text-center py-4 text-xs sm:text-sm md:text-base'>
        <div>
            <img src={assets.exchange_icon} className='w-10 m-auto mb-4' alt="" />
            <p className='font-semibold proza-libre-regular'>Hassle-Free Exchanges</p>
            <p className='lato-regular'></p>
        </div>
        <div>
            <img src={assets.quality_icon} className='w-10 m-auto mb-4' alt="" />
            <p className='font-semibold proza-libre-regular'> Guaranteed Performance</p>
            <p className='lato-regular'></p>
        </div>
        <div>
            <img src={assets.support_img} className='w-10 m-auto mb-4' alt="" />
            <p className='font-semibold proza-libre-regular'>24x7 Customer Support</p>
            <p className='lato-regular'></p>
        </div>
    </div>
  )
}

export default OurPolicy