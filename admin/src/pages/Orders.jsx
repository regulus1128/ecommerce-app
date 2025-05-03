import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(backendURL + "/api/order/all-orders", {
        withCredentials: true
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
      toast.error(error.message);
    }
  };

  const statusHandler = async (e, orderId) => { 
    try {
      const newStatus = e.target.value;
      const response = await axios.put(
        backendURL + '/api/order/update-status', 
        { orderId, status: newStatus }, 
        { withCredentials: true }
      );
      
      if(response.data.success){
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        navigate('/');
      }
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div>
      <h3>Orders Page</h3>
      <div>
        {orders.map((order, index) => (
          <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr-1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-300 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-600" key={index}>
            <div>
            <div className="lato-regular">
              {order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return (
                    <p className="py-1" key={index}>
                      {item.name} x {item.quantity} | Size: <span>{item.size}</span>
                    </p>
                  );
                } else {
                  return (
                    <p className="py-1" key={index}>
                      {item.name} x {item.quantity} <span>{item.size}</span>,
                    </p>
                  );
                }
              })}
            </div>
            <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " + order.address.lastName}</p>
            <div className="lato-regular">
              <p>{order.address.address}</p>
              {/* <p>{order.address.city + ', ' + order.address.state}</p> */}
              <p>{order.address.pinCode}</p>
            </div>
            <p className="lato-regular">{order.address.contactNumber}</p>
          </div>
          <div>
            <p className="text-sm sm:text-[16px] lato-regular">Items: {order.items.length}</p>
            <p className="mt-3 lato-regular">Method: {order.paymentMethod}</p>
            <p className="lato-regular">Payment: { order.payment ? 'Done' : 'Pending'}</p>
            <p className="lato-regular">Date: {new Date(order.date).toLocaleDateString()}</p>
          </div>
          <p className="text-sm sm:text-[16px] lato-regular">{currency} {order.amount}</p>
          <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className="p-2 font-bold lato-regular">
            <option value="Order Placed">Order Placed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
