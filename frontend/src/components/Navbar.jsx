import React, { useContext, useState, useEffect } from 'react'
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios';
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, setCartItems, backendUrl, getUserCart } = useContext(ShopContext);
  const [userDetails, setUserDetails] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  

  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/logout', {}, { withCredentials: true });

      if(response.data.success){
        setToken('');
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/user/get-user-details', { withCredentials: true });
        if(response.data.success){
          setUserDetails(response.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if(token){
      fetchUserDetails();
    }

  }, [token]);
  
  return (
    <div className='flex justify-between items-center py-5 font-medium'>
      <Toaster />
      <Link to='/'><img src={assets.logo4} className='w-20' alt="" /></Link>

        <ul className='hidden sm:flex gap-5 text-md text-gray-600'>
          <NavLink to='/' className="flex flex-col items-center gap-1">
            <p className='proza-libre-regular'>Home</p>
            <hr className='w-full border-none h-1 bg-[#2b7fff] hidden' />
          </NavLink>
          <NavLink to='/collection' className="flex flex-col items-center gap-1">
            <p className='proza-libre-regular'>Collection</p>
            <hr className='w-full border-none h-1 bg-[#2b7fff] hidden' />
          </NavLink>
          <NavLink to='/about' className="flex flex-col items-center gap-1">
            <p className='proza-libre-regular'>About</p>
            <hr className='w-full border-none h-1 bg-[#2b7fff] hidden' />
          </NavLink>
          <NavLink to='/contact' className="flex flex-col items-center gap-1">
            <p className='proza-libre-regular'>Contact</p>
            <hr className='w-full border-none h-1 bg-[#2b7fff] hidden' />
          </NavLink>
        </ul>

        <div className='flex items-center gap-6'>
          <img src={assets.search_icon} onClick={() => setShowSearch(true)} className='w-5 cursor-pointer' alt="" />

          <div className='relative z-10'
          onClick={() => setShowDropdown(!showDropdown)}
          onMouseLeave={() => setShowDropdown(false)}>
            <Link to='/login'><CgProfile size={25}/></Link>
            <div className={`${showDropdown ? 'block' : 'hidden'} md:group-hover:block absolute dropdown-menu right-0 pt-4`}>
              <div className='flex flex-col gap-2 w-40 py-3 px-5 bg-gray-100'>
              {
                !!token ? (
                  <>
                  <p className='proza-libre-regular text-[15px]'>{userDetails.name}</p>
                  <hr />
                  <Link to='/my-profile' className='proza-libre-regular cursor-pointer hover:text-indigo-600'>My Profile</Link>
                  </>
                ) : (
                  ''
                )
              }
              {
                !!token ? (
                  <Link to='/my-reviews' className='proza-libre-regular cursor-pointer hover:text-indigo-600'>My Reviews</Link>
                  ) : ''
              }
              {
                !!token ? (
                  <Link to='/my-wishlist' className='proza-libre-regular cursor-pointer hover:text-indigo-600'>My Wishlist</Link>
                  ) : ''
              }  
                <p onClick={() => navigate('/orders')} className='proza-libre-regular cursor-pointer hover:text-indigo-600'>Orders</p>
                {
                  !!token ? (
                    <p onClick={logout} className='proza-libre-regular cursor-pointer hover:text-indigo-600'>Logout</p>
                  ) : (
                    <Link to="/login" className='proza-libre-regular cursor-pointer hover:text-indigo-600'>Login</Link>
                  )
                }
                {
                  !!token ? (
                    ""
                  ) : <a href="https://solevibe-admin.vercel.app" target="_blank" rel="noopener noreferrer" className='proza-libre-regular cursor-pointer hover:text-indigo-600'>Admin Login</a>
                }
                
              </div>
            </div>
          </div>
          <Link to='/cart' className='relative'>
            <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-gray-500 text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
          </Link>

          {/* mobile view  */}
          <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer lg:hidden' alt="" />
        </div>
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden z-10 duration-500 bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
          <div className='flex flex-col text-gray-600'>
            <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3'>
              <img src={assets.dropdown_icon} className='h-4 rotate-180 cursor-pointer' alt="" />
            </div>
            <hr />
            <NavLink to='/' className='proza-libre-regular py-2 pl-6' onClick={() => setVisible(false)}>Home</NavLink>
            <NavLink to='/collection' className='proza-libre-regular py-2 pl-6' onClick={() => setVisible(false)}>Collection</NavLink>
            <NavLink to='/about'className='proza-libre-regular py-2 pl-6' onClick={() => setVisible(false)}>About</NavLink>
            <NavLink to='/contact' className='proza-libre-regular py-2 pl-6' onClick={() => setVisible(false)}>Contact</NavLink>
          </div>
        </div>

    </div>
  )
}

export default Navbar