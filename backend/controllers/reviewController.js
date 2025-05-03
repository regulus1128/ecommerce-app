import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js"
import jwt from "jsonwebtoken";

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;
        const token = req.cookies.userToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const existingReview = await reviewModel.findOne({ product: productId, user: userId });

        if (existingReview) {
          return res.status(400).json({ message: "You have already reviewed this product!" });
        }

        const review = new reviewModel({
            product: productId,
            user: userId,
            rating,
            comment
        });

        await review.save();

        const allReviews = await reviewModel.find({ product: productId });
        const totalReviews = allReviews.length;
        const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

        await productModel.findByIdAndUpdate(productId, {
            totalReviews,
            averageRating,
        })

        res.status(201).json({ success: true, message: "Review added successfully!", review });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getReview = async (req, res) => {
    try {
        // const productId = req.params.productId;
        const token = req.cookies.userToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        const reviews = await reviewModel.find({ user: userId }).populate("product", 'name image');

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }
}

const getAllReviews = async (req, res) => {
    try {
        const productId = req.params.productId;
        const reviews = await reviewModel.find({ product: productId }).populate("user", "name");
        res.status(200).json({ success: true, reviews });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });

    }
}

const getSingleReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const token = req.cookies.userToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        const singleReview = await reviewModel.find({ user: userId, product: productId }).populate("product", 'name');
        // console.log(singleReview);
        res.status(200).json({ success: true, singleReview });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const editReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { rating, comment } = req.body;
        const token = req.cookies.userToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        const updatedReview = await reviewModel.findOneAndUpdate({ user: userId, product: productId }, { rating, comment }, { new: true });
        console.log(updatedReview);

        if(updatedReview){
            res.status(200).json({ success: true, message: "Review updated successfully!" });
        }
        else{
            res.status(401).json({ success: false, message: "Something went wrong!" });
        }

    } catch (error) {
        // console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { addReview, getReview, getAllReviews, editReview, getSingleReview };