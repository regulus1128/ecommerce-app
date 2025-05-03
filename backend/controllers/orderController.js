import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Stripe from 'stripe';
import Razorpay from "razorpay";
import { validateAndEnrichItems } from "../utils/validateAndEnrichItems.js";


const currency = 'inr';
const deliveryCharges = 20;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;

        const token = req.cookies.userToken;
        // console.log('Request cookies', token);

        if (!token) {
          return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log(decoded);
      const userId = decoded.id;


      const enrichedItems = await validateAndEnrichItems(items);

      const orderData = {
            userId,
            items: enrichedItems,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: new Date(),
        }
        
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        for(const item of items){
          const product = await productModel.findById(item.productId);
          if(!product) continue;

          const sizeObj = product.sizes.find((s) => s.size === item.size);

          if(sizeObj){
            sizeObj.stock -= item.quantity;
            if(sizeObj.stock < 0) sizeObj.stock = 0; //* to prevent negative stock
          }

          await product.save();
        }

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // console.log(`Cart data: ${cartData}`);

        res.status(200).json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const placeOrderStripe = async (req, res) => {

    try {
        // console.log('Request body in place order: ', req.body);
        const { items, amount, address } = req.body;

        const token = req.cookies.userToken;

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const { origin } = req.headers;

        const enrichedItems = await validateAndEnrichItems(items);

        const orderData = {
          userId,
          items: enrichedItems,
          amount,
          address,
          paymentMethod: "Stripe",
          payment: false,
          date: new Date(),
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        for (const item of items) {
          const product = await productModel.findById(item.productId);
          if (!product) continue;
    
          const sizeObj = product.sizes.find((s) => s.size === item.size);
          if (sizeObj) {
            sizeObj.stock -= item.quantity;
            if (sizeObj.stock < 0) sizeObj.stock = 0;
          }
    
          await product.save();
        }
    
        // ✅ Clear cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        const lineItems = items.map((item) => ({
          price_data: {
            currency: currency,
            product_data: {
              name: item.name
            },
            unit_amount: item.price * 100
          },
          quantity: item.quantity
        }))

        lineItems.push({
          price_data: {
            currency: currency,
            product_data: {
              name: 'Delivery Charges'
            },
            unit_amount: deliveryCharges * 100
          },
          quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
          success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
          cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
          line_items: lineItems,
          mode: 'payment'

        })

        res.status(200).json({ success: true, session_url: session.url });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const verifyStripe = async (req, res) => {

  const { orderId, success } = req.body;

  const token = req.cookies.userToken;

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userId = decoded.id;

  try {
    if(success === 'true'){
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const placeOrderRazorpay = async (req, res) => {

  try {
    const { items, amount, address } = req.body;

    const token = req.cookies.userToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const enrichedItems = await validateAndEnrichItems(items);

    const orderData = {
      userId,
      items: enrichedItems,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: new Date(),
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    for (const item of items) {
      const product = await productModel.findById(item.productId);
      if (!product) continue;

      const sizeObj = product.sizes.find((s) => s.size === item.size);
      if (sizeObj) {
        sizeObj.stock -= item.quantity;
        if (sizeObj.stock < 0) sizeObj.stock = 0;
      }

      await product.save();
    }

    // ✅ Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    }

    razorpayInstance.orders.create(options, (error, order) => {
      if(error){
        console.log(error);
        return res.status(500).json({ success: false, message: error });
      }
      res.status(200).json({ success: true, order });
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const verifyRazorpay = async (req, res) => {
  try {

    const { razorpay_order_id } = req.body;
    const token = req.cookies.userToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    // console.log(orderInfo);
    if(orderInfo.status === "paid"){
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.status(200).json({ success: true, message: "Payment successful!" });
    } else {
      res.status(500).json({ success: false, message: "Payment failed!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(201).json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const userOrders = async (req, res) => {
    try {
      // Verify the user first
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      
      const userId = req.user.id;
      const orders = await orderModel.find({ userId }).sort({ date: -1 }); // Newest first
      
      if (!orders) {
        return res.status(200).json({ success: true, orders: [] });
      }
      
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message,
        errorCode: "USER_ORDERS_FETCH_FAILED"
      });
    }
  }

  const updateStatus = async (req, res) => {
    try {
      const { orderId, status } = req.body;
      
      // Verify admin privileges first
      if (!req.admin) {
        return res.status(403).json({ 
          success: false, 
          message: "Admin privileges required" 
        });
      }
  
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: "Order not found" 
        });
      }
  
  
      res.status(200).json({ 
        success: true, 
        message: "Status updated",
        order
      });
    } catch (error) {
      console.error("Status update error:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  };

const getOrderStatus = async (req, res) => {
  try {
    // console.log("[BACKEND] Received order ID:", req.params.orderId);
    const { orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid order ID format"
      });
    }

    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      status: order.status,
      orderId: order._id
    });

  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      code: "STATUS_CHECK_FAILED"
    });
  }
}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, getOrderStatus, verifyStripe, verifyRazorpay };
