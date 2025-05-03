import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {

    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        ); 

        const parsedSizes = JSON.parse(sizes);

        const productData = {
            name, 
            description,
            category,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === "true" ? true : false,
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now()
        }


        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added!" });

    } catch (error) {
        res.json({ message: error.message });
    }
}

const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });    
    } catch (error) {
        console.log(error);
    }
}

const listProductsPublic = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
    }
}

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findById(productId);
        res.status(200).json({ success: true, product })
    } catch (error) {
        console.log(error);
        
    }
}

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed!" });
    } catch (error) {
        console.log(error);
    }
}

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, subCategory, sizes } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );
        const parsedSizes = JSON.parse(sizes);

        const updatedData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            sizes: parsedSizes,
        }

        if(imagesUrl.length > 0){
            updatedData.image = imagesUrl;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });

        if(!updatedProduct){
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        res.status(200).json({ success: true, message: "Product updated!", product: updatedProduct });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
    }
}

export { addProduct, listProducts, removeProduct, singleProduct, listProductsPublic, getProductById, editProduct };