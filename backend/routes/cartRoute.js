import express from "express";
import { addToCart, updateCart, getCart } from "../controllers/cartController.js";
import authUser  from "../middleware/auth.js";
const cartRouter = express.Router();

cartRouter.post('/add-to-cart', authUser, addToCart);
cartRouter.post('/update-cart', authUser, updateCart);
cartRouter.post('/get-cart', authUser, getCart);  

export default cartRouter;

