import React from 'react'
import { assets } from "../assets/assets.js"
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendURL } from '../App';

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(backendURL + '/api/user/admin-logout', {}, {
        withCredentials: true
      });

      if(response.data.success){
        toast.success('Logged out successfully!');
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className='flex items-center justify-between py-2 px-2'>
        <NavLink to='/home'>
          <img src={assets.logo4} className='w-[180px]' alt="" />
        </NavLink>
        <button onClick={handleLogout} className='bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 sm:px-7 sm:py-2 mr-2 rounded-sm proza-libre-regular'>Logout</button>
    </div>
  )
}

export default Navbar