import productModel from "../models/productModel.js";

const validateAndEnrichItems = async (items) => {
    return await Promise.all(
      items.map(async (item) => {
        const product = await productModel.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
  
        const sizeObj = product.sizes.find((s) => s.size === item.size);
        if (!sizeObj) {
          throw new Error(`Size ${item.size} not available for product ${product.name}`);
        }
  
        if (sizeObj.stock < item.quantity) {
          throw new Error(`This product is currently out of stock!`);
        }
  
        return {
          productId: item.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          size: item.size,
          quantity: item.quantity,
        };
      })
    );
};

export { validateAndEnrichItems };