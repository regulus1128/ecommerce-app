import React, { useContext, useEffect, useState } from 'react'
import ReactStars from "react-stars";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import toast, { Toaster } from 'react-hot-toast';

const EditReview = () => {

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { productId } = useParams();
  const { backendUrl } = useContext(ShopContext);
  const [productName, setProductName] = useState("");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${backendUrl}/api/review/edit-review/${productId}`, { rating, comment }, { withCredentials: true });
      if(response.data.success){
        toast.success(response.data.message);
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  const getReview = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/get-single-review/${productId}`, { withCredentials: true });
      console.log('response in get reviews: ', response);
      if(response.data.success){
        const review = response.data.singleReview[0];
        setRating(review.rating);
        setComment(review.comment);
        setProductName(review.product.name);

      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getReview();
  }, [productId]);

  
  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4'>
      <Toaster />
      <form onSubmit={handleSubmitReview} className='w-full max-w-2xl bg-white rounded-sm shadow-lg p-6 space-y-6'>
        <h2 className='text-2xl md:text-3xl font-semibold text-gray-800 text-center proza-libre-regular'>Edit Your Review</h2>
        <p className='text-center proza-libre-regular'>{productName}</p>
        <div className='flex justify-center'>
          <ReactStars 
            count={5} 
            value={rating} 
            onChange={setRating} 
            size={window.innerWidth < 768 ? 30 : 40}
            className='cursor-pointer'
          />
        </div>
        <textarea 
          value={comment} 
          className='w-full min-h-[150px] p-4 border border-gray-300 rounded-sm resize-none focus:border-transparent lato-regular'
          placeholder='Describe the product and share your experience...'
          required 
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className='flex justify-center'>
          <button 
            type='submit' 
            className='w-full md:w-auto px-4 py-3 bg-cyan-500 hover:bg-cyan-600 transition-colors duration-200 rounded-sm text-white  text-md shadow-md hover:shadow-lg proza-libre-regular cursor-pointer'
          >
            UPDATE REVIEW
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditReview