import express from "express";
import { addProduct, removeProduct, listProducts, singleProduct, listProductsPublic, getProductById, editProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth  from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post('/add-product', adminAuth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]),  addProduct);
productRouter.delete('/remove-product', adminAuth, removeProduct);
productRouter.put('/edit-product/:id', adminAuth, editProduct);
productRouter.post('/get-single-product', adminAuth, singleProduct);
productRouter.get('/list-product', adminAuth, listProducts);
productRouter.get('/list-product-public', listProductsPublic);
productRouter.get('/get-product-by-id/:productId', getProductById);

export default productRouter;