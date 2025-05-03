import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(location.pathname.includes('collection')){
            setVisible(true);
        }
        else    setVisible(false);
    }, [location])

  return showSearch && visible ?  (
    <div className=' text-center'>
        <div className='inline-flex items-center justify-center border px-6 py-3 my-6 mx-4 rounded-full w-3/4 sm:w-1/2'>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...' className='flex-1 outline-none bg-inherit text-sm' name="" id="" />
            <img src={assets.search_icon} className='w-4' alt="" />
        </div>
        <img src={assets.cross_icon} onClick={() => setShowSearch(false)} className='inline w-3 cursor-pointer mb-1' />

    </div>
  ) : null
}

export default SearchBar