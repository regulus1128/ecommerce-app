import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Newsletter = () => {

    const { backendUrl } = useContext(ShopContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;

        try {
            const response = await axios.post(backendUrl + '/api/email/subscribe', { email }, { withCredentials: true });
            console.log(response);
            if(response.data.success){
                toast.success(response.data.message, {
                    style: {
                    //   border: '1px solid #2E1E12',
                      color: '#2E1E12',
                    },
                    
                  });
                
            } else {
                toast.error('Something went wrong!');
            }
        } catch (error) {
            console.log(error);
        }

    }
  return (
    <div className='text-center mt-8'>
        <Toaster />
        <p className='text-3xl font-medium proza-libre-regular'>SUBSCRIBE NOW!</p>
        <p className='mt-3 lato-regular text-md'>Avail extra benefits, and get a chance to win the match pass!</p>
        <form onSubmit={handleSubmit} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-[#2b7fff] pl-3'>
            <input type="email" className='w-full sm:flex-1 outline-none lato-regular' placeholder='Enter your email' name="" id="" required/>
            <button type='submit' className='bg-[#2b7fff] hover:bg-[#2b80fff4] text-white text-s font-bold px-8 py-2 lato-regular cursor-pointer'>
                SUBSCRIBE
            </button>

        </form>


    </div>
  )
}

export default Newsletter