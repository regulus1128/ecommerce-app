import mongoose from "mongoose";

const connectDb = async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`)
    .then(() => console.log('Connected'))
    .catch((error) => console.error(error));
};

export default connectDb;