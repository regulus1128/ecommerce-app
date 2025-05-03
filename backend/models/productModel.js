import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    sizes: [
        {
          size: { type: String, required: true },
          stock: { type: Number, required: true, default: 10 },
        },
    ],
    bestSeller: {
        type: Boolean
    },
    date: {
        type: Number,
        required: true,
        default: Date.now()
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },

});

const productModel = mongoose.models.productSchema || mongoose.model("productSchema", productSchema);

export default productModel;