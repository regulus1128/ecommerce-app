import express from "express";
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, getOrderStatus, verifyStripe, verifyRazorpay } from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import adminAuth  from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// admin features
orderRouter.get("/all-orders", adminAuth, allOrders);
orderRouter.put("/update-status", adminAuth, updateStatus);

// payment features    
orderRouter.post("/place-order", authUser, placeOrder);
orderRouter.post("/place-order-stripe", authUser, placeOrderStripe);
orderRouter.post("/place-order-razorpay", authUser, placeOrderRazorpay);

// user features
orderRouter.get("/user-orders", authUser, userOrders);
orderRouter.get("/order-status/:orderId", authUser, getOrderStatus);

// verify payment
orderRouter.post("/verify-stripe", authUser, verifyStripe);
orderRouter.post("/verify-razorpay", authUser, verifyRazorpay);

export default orderRouter;