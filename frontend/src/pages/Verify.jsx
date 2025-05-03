import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Verify() {

    const { token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            if(!token) return null;

            const response = await axios.post(backendUrl + '/api/order/verify-stripe', { success, orderId }, { withCredentials: true });

            console.log(response);

            if(response.data.success){
                setCartItems({});
                navigate('/');
            } else{
                navigate('/cart');
            }

            
        } catch (error) {
            console.log(error);
            toast.error(error.message);

        }
    }

    useEffect(() => {
        verifyPayment();
    }, [token])




  return (
    <div>
        <Toaster/>
    </div>
  )
}

export default Verify