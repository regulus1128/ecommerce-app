import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Add to wishlist
const addToWishlist = async (req, res) => {
    const token = req.cookies.userToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const { productId } = req.body;

    try {
        const user = await userModel.findById(userId);
        if(!user.wishlist.includes(productId)){
            user.wishlist.push(productId);
            await user.save();
        }
        res.status(200).json({ success: true, wishlist: user.wishlist, message: "Added to wishlist!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }

} 

const removeFromWishlist = async (req, res) => {
    const token = req.cookies.userToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const { productId } = req.body;

    try {
        const user = await userModel.findById(userId);
        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
        await user.save();
        res.status(200).json({ success: true, wishlist: user.wishlist, message: "Removed from wishlist!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getWishlist = async (req, res) => {
    const token = req.cookies.userToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    try {
        const user = await userModel.findById(userId).populate("wishlist");
        res.status(200).json({ success: true, wishlist: user.wishlist });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { addToWishlist, removeFromWishlist, getWishlist };