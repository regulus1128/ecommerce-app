import express from "express";
import cors from 'cors';
import "dotenv/config";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import cookieParser from 'cookie-parser';
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import emailRouter from "./routes/emailRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;
connectDb();
connectCloudinary();

app.use(cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/email', emailRouter);
app.use('/api/review', reviewRouter);
app.use('/api/wishlist', wishlistRouter);


app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT} ✅`)
});



