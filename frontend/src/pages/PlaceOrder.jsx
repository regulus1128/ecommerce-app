import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'


const PlaceOrder = () => {

  const [method, setMethod] = useState('COD');
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, deliveryFee, products } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '', 
    state: '',
    pinCode: '',
    contactNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Payment details of your order',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(backendUrl + '/api/order/verify-razorpay', response, { withCredentials: true });
          if(data.success){
            toast.success(data.message);
            setCartItems({});
          }
        } catch (error) {
          toast.error(error);
        }
      }
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to place order!");
      // navigate('/login');
      return;
    }

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if(cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if(itemInfo) {
          
              orderItems.push({
                quantity: cartItems[items][item],
                size: item,
                productId: itemInfo._id,
                name: itemInfo.name,
                price: itemInfo.price,
                image: itemInfo.image,
              });
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + deliveryFee,
      };

      switch(method) {
        case 'COD':
          const response = await axios.post(`${backendUrl}/api/order/place-order`, orderData, { withCredentials: true });
          if(response.data.success) {
            setCartItems({});
            toast.success("Order placed successfully!");
            navigate('/orders');
          } else {
            toast.error(response.data.message || "Failed to place order");
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/place-order-stripe', orderData, { withCredentials: true });
          if(responseStripe.data.success){
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
            toast.success("Order placed successfully!");
            setCartItems({});
          } else{
            toast.error(responseStripe.data.message);
          }
          break;
          
        case 'razorpay':
          const responseRazorpay = await axios.post(backendUrl + '/api/order/place-order-razorpay', orderData, { withCredentials: true });

          if(responseRazorpay.data.success){
            initPay(responseRazorpay.data.order);
            toast.success("Order placed successfully!");
            navigate('/orders');

          }
          break;

        default:
          orderData.paymentMethod = 'COD';
          break;
      }
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong while placing your order");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]'>
      <Toaster/>

      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-4'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>

        <div className='flex gap-3'>
          <input type="text" onChange={handleChange} name='firstName' value={formData.firstName} className='border rounded py-2 px-4 w-full' placeholder='First name' required />

          <input type="text" onChange={handleChange} name='lastName' value={formData.lastName} className='border rounded py-2 px-4 w-full' placeholder='Last name' required />
        </div>

        <input type="email" onChange={handleChange} name='email' value={formData.email} className='border rounded py-2 px-4 w-full' placeholder='Email address' required />

        <input type="text" onChange={handleChange} name='address' value={formData.address} className='border rounded py-2 px-4 w-full' placeholder='Address' required />

        <div className='flex gap-3'>
          <input type="text" onChange={handleChange} name='city' value={formData.city} className='border rounded py-2 px-4 w-full' placeholder='City' required />

          <input type="text" onChange={handleChange} name='state' value={formData.state} className='border rounded py-2 px-4 w-full' placeholder='State' required />
        </div>

        <div className='flex gap-3'>
          <input type="number" onChange={handleChange} name='pinCode' value={formData.pinCode} className='border rounded py-2 px-4 w-full'  placeholder='PIN Code' required />

          <input type="number" onChange={handleChange} name='contactNumber' value={formData.contactNumber} className='border rounded py-2 px-4 w-full' placeholder='Contact Number' required/>
        </div>
      </div>

      {/* right side */}

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal/>
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'}/>

          <div className='flex gap-3 flex-col lg:flex-row'>

            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-4 cursor-pointer'>
              <p className={`min-w-4 h-4 border border-neutral-200 rounded-full ${method === 'stripe' ? 'bg-blue-500' : ''}`}></p>
              <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
            </div>

            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-4 cursor-pointer'>
            <p className={`min-w-4 h-4 border border-neutral-200 rounded-full ${method === 'razorpay' ? 'bg-blue-500' : ''}`}></p>
              <img src={assets.razorpay_logo} className='h-5 mx-4' alt="" />
            </div>
            <div onClick={() => setMethod('COD')} className='flex items-center gap-3 border p-2 px-4 cursor-pointer'>
            <p className={`min-w-4 h-4 border border-neutral-200 rounded-full ${method === 'COD' ? 'bg-blue-500' : ''}`}></p>
              <p className='text-indigo-600 text-md font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type="submit" className='bg-blue-500 text-white px-16 py-3 rounded-sm text-md hover:bg-blue-600 cursor-pointer'>PLACE ORDER</button>
          </div>
        </div>


      </div>

    </form>
  )
}

export default PlaceOrder