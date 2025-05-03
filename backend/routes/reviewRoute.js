import express from "express";
import authUser from "../middleware/auth.js";
import { addReview, editReview, getAllReviews, getReview, getSingleReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/product/:productId/add-review", authUser, addReview);
reviewRouter.get("/get-review", authUser, getReview); //to get all reviews made by a user
reviewRouter.get("/product/:productId/get-all-reviews", getAllReviews); // to get all reviews of a product
reviewRouter.get("/get-single-review/:productId", authUser, getSingleReview); // to get all reviews of a product
reviewRouter.put("/edit-review/:productId", authUser, editReview);

export default reviewRouter;