import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productSchema",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },   
}, { timestamps: true });

const reviewModel = mongoose.models.review || mongoose.model("reviewSchema", reviewSchema);

export default reviewModel;

