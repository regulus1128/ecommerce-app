import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendURL, currency } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = () => {

  const [list, setList] = useState([]);
  const navigate = useNavigate();
  

  const fetchList = async () => {
    try {
      const response = await axios.get(backendURL + '/api/product/list-product', { withCredentials: true });
      console.log(response.data);
      if(response.data.success){
        setList(response.data.products);
      } else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(backendURL + '/api/product/remove-product', { id }, { withCredentials: true });
      // console.log(response);
      if(response.data.success){
        toast.success(response.data.message);
        await fetchList();
      } else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const handleEdit = async (id) => {
    // Navigate to the edit page
    navigate(`/edit/${id}`);
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <>
      <p className='mb-3 lato-regular'>All Products</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 bg-neutral-100 text-sm'>
          <b className='proza-libre-regular mt-1'>Image</b>
          <b className='text-center proza-libre-regular mt-1'>Name</b>
          <b className='text-center proza-libre-regular mt-1'>Category</b>
          <b className='text-center proza-libre-regular mt-1'>Price</b>
          {/* <b className='text-center'>Action</b> */}
        </div>
        {
          list.map((item, index) => (
            <div key={index} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 py-1 px-2 text-sm'>
              <img src={item.image[0]} className='w-14' alt="" />
              <p className='text-center lato-regular'>{item.name}</p>
              <p className='text-center lato-regular'>{item.category}</p>
              <p className='text-center lato-regular'>{currency} {item.price}</p>
              <div className='flex flex-col items-center'>
                <button onClick={() => handleEdit(item._id)} className='md:text-center cursor-pointer bg-green-500 hover:bg-green-600 px-3 py-2 w-18 rounded-sm text-white lato-regular'>Edit</button>
                <p onClick={() => deleteItem(item._id)} className='md:text-center cursor-pointer bg-red-500 hover:bg-red-600 px-3 py-2 w-18 mt-1 rounded-sm text-white lato-regular'>Delete</p>
              </div>
              <hr className='border-gray-500 my-2 w-full' />
            </div>
          ))
          
        }
        
      </div>
    </>
  )
}

export default List