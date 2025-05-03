import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';


const Orders = () => {
  const { backendUrl, token, currency, setToken } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;
  
      const response = await axios.get(`${backendUrl}/api/order/user-orders`, {
        withCredentials: true, 
      
      });
  
      if (response.data.success) {
        let allOrdersItem = [];
  
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['orderId'] = order._id;
            allOrdersItem.push(item);
          });
        });
  
        setOrderData([...allOrdersItem.reverse()]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          await loadOrderData();
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle logout or token refresh
          console.log("Session expired, please login again");
          // You might want to redirect to login here
        }
      }
    };
    
    fetchData();
  }, [token]);

  const handleTrackOrder = async (orderId) => {

    try {
      const response = await axios.get(`${backendUrl}/api/order/order-status/${orderId}`, {
        withCredentials: true,
      });
      setOrderData(prev => prev.map(item => item.orderId === orderId ? { ...item, status: response.data.status }
        : item
      ))

      toast.info(`Status: ${response.data.status}`);
      
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login again");
        navigate('/login');
      } else {
        toast.error("Failed to get status");
      }
    }
  };
  

  return (
    <div className='border-t pt-16'>
      <Toaster />
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'}/>
      </div>

      {
        orderData.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No orders found.</p>
        ) : (
          <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-p flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-md'>
                {item.image && <img src={item.image[0]} className='w-16 sm:w-20' alt="" />}
                <div>
                  <p className='sm:text-base font-medium proza-libre-regular'>{item.name}</p>
                  <div className='flex items-center gap-4 mt-2 text-base'>
                    <p className='lato-regular'>{currency} {item.price}</p>
                    <p className='lato-regular'>Quantity: {item.quantity}</p>
                    <p className='lato-regular'>Size: {item.size}</p>
                  </div>
                  <p className='mt-2 lato-regular'>Date: {new Date(item.date).toDateString()}</p>
                  <p className='mt-2 lato-regular'>Payment: {item.paymentMethod}</p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-3'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='lato-regular'>{item.status}</p>
                </div>
                <div className='flex flex-col'>
                <button onClick={() => handleTrackOrder(item.orderId)} className='px-4 py-2 text-sm font-medium rounded-sm bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer'>
                  Track Order
                </button>
                {/* let users add a review only after the product is delivered */}
                {
                  item.status === 'Delivered' ? <Link to={`/add-review/${item.productId}`}>
                  <button className='px-4 py-2 text-sm font-medium rounded-sm bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer mt-2'>
                    Add Review
                  </button>
                  </Link> : ""
                }
                

                </div>
                
                
              </div>
            </div>
          ))
          }
        </div>
      )}
    </div>
  )
}

export default Orders