import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const addToCart = async (req, res) => {

    try {
        // console.log(req.body);
        const { productId, size } = req.body;
        const token = req.cookies.userToken;
        // console.log(userId);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decoded);
        const userId = decoded.id;


        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        if(cartData[productId]) {
            if(cartData[productId][size]) {
                cartData[productId][size] += 1;
            } else {
                cartData[productId][size] = 1;
            }
        } else {    
            cartData[productId] = { [size]: 1 };
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Product added to cart" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateCart = async (req, res) => {
    try {
        const { userId, productId, size, quantity } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        cartData[productId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart updated" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getCart = async (req, res) => {
    try {
        // console.log('req.user in get cart:', req.user);
        const userId = req.user.id;
        // console.log('user id in get cart', userId);

        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


export { addToCart, updateCart, getCart };