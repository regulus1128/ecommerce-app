import express from "express";
import authUser from "../middleware/auth.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add-to-wishlist", authUser, addToWishlist);
wishlistRouter.post("/remove-from-wishlist", authUser, removeFromWishlist);
wishlistRouter.get("/get-wishlist", authUser, getWishlist);

export default wishlistRouter;