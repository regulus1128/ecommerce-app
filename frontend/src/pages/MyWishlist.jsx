import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import toast, { Toaster } from 'react-hot-toast';
import Title from '../components/Title';
import { Link } from 'react-router-dom';

const MyWishlist = () => {
    const { backendUrl } = useContext(ShopContext);
    const [wishlist, setWishlist] = useState([]);


    const fetchWishlist = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/wishlist/get-wishlist', { withCredentials: true });
            console.log(response);
            if(response.data.success){
                setWishlist(response.data.wishlist);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const removeFromWishlist = async (productId) => {
        try {
            const response = await axios.post(backendUrl + '/api/wishlist/remove-from-wishlist', { productId }, { withCredentials: true });
            if(response.data.success){
                toast.success(response.data.message);
                setWishlist(prev => prev.filter(item => item._id !== productId));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchWishlist();
    }, [])

  return (
    <div>
        <div className="text-2xl mb-8">
            <Title text1={"MY"} text2={"WISHLIST"}></Title>
        </div>
        <Toaster />
        <div className="px-4 py-8">
  {wishlist.length > 0 ? (
    
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {wishlist.map((item) => (
    
      <div className="rounded-sm shadow-sm overflow-hidden flex flex-col bg-white transition-transform hover:scale-[1.01]">
        <Link to={`/product/${item._id}`} key={item._id}>
        <img
          src={item.image[0]}
          alt={item.name}
          className="w-full h-60 object-cover"
        />
        </Link>
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <h2 className="text-lg font-semibold proza-libre-regular">
              {item.name}
            </h2>
            <p className="text-gray-600 lato-regular mt-1">
              ₹ {item.price}
            </p>
          </div>
          <div className="mt-6">
            <button
              className="w-full bg-rose-500 rounded-sm text-white px-4 py-3 text-sm transition-colors duration-300 hover:bg-rose-600 cursor-pointer proza-libre-regular"
              onClick={(e) => {
                e.preventDefault(); // prevent navigation
                removeFromWishlist(item._id);
              }}
            >
              REMOVE FROM WISHLIST
            </button>
            
          </div>
        </div>
      </div>
  ))}
</div>

  ) : (
    <p className="text-center text-lg text-gray-500 lato-regular">Your wishlist is empty! </p>
  )}
</div>

    </div>
  )
}

export default MyWishlist