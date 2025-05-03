import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-1 border-neutral-300'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[16px]'>

            <NavLink to='/home/add' className='flex items-center gap-3 border border-neutral-300 border-r-0 px-3 py-2 rounded-1 lato-regular'>
                <img src={assets.add_icon} alt="" className='w-5 h-5'/>
                <p className='hidden md:block'>Add items</p>
            </NavLink>

            <NavLink to='/home/list' className='flex items-center gap-3 border border-neutral-300 border-r-0 px-3 py-2 rounded-1 lato-regular'>
                <img src={assets.order_icon} alt="" className='w-5 h-5'/>
                <p className='hidden md:block'>List items</p>
            </NavLink>

            <NavLink to='/home/orders' className='flex items-center gap-3 border border-neutral-300 border-r-0 px-3 py-2 rounded-1 lato-regular'>
                <img src={assets.order} alt="" className='w-5 h-5'/>
                <p className='hidden md:block'>Orders</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar