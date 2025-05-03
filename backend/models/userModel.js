import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        default: {},
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productSchema'
        }
    ]
    
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('userSchema', userSchema);

export default userModel;
