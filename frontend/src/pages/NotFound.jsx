import React from 'react'
import { assets } from '../assets/frontend_assets/assets'


const NotFound = () => {
  return (
    <div className='flex justify-center'>
        <div className='flex flex-col items-center'>
            <img src={assets.notfound} className='w-[800px]' alt="" />
            <div className='mt-4'>
                <p className='proza-libre-regular text-2xl'>Oops! The page you are looking for does not exist.</p>
            </div>
        </div>
        

    </div>
  )
}

export default NotFound