import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import Reviews from "./Reviews";
import ReactStars from "react-stars";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        console.log(item);
        return null;
      }
    });
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/wishlist/add-to-wishlist",
        { productId },
        { withCredentials: true }
      );
      // console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please login to add to wishlist!");
    }
  };

  const checkIfWishlisted = async (productId) => {
    try {
      const response = await axios.get(
        backendUrl + "/api/wishlist/get-wishlist",
        { withCredentials: true }
      );
      const wishlist = response.data.wishlist;
      const isInWishlist = wishlist.some((item) => item._id === productId);
      setIsWishlisted(isInWishlist);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (productId) {
      checkIfWishlisted(productId);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-12 transition-opacity ease-in duration-700 opacity-100">
      {/* product data */}
      <Toaster />
      <div className="flex gap-14 sm:gap-14 flex-col sm:flex-row">
        {/* product images */}
        <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="" />
          </div>
        </div>
        {/* -------product info------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2 proza-libre-regular">
            {productData.name}
          </h1>
          <div className="flex items-center gap-1 mt-2">
            <ReactStars
              count={5}
              value={productData.averageRating} // Example: 4.2
              size={24}
              edit={false}
              color2={"#ffd700"} // Star color
            />
            <p className="pl-3 mt-1 lato-regular">
              {productData.totalReviews} Reviews
            </p>
          </div>
          <p className="mt-6 text-2xl font-medium lato-regular">
            {currency} {productData.price}
          </p>
          <p className="mt-5 md:w-4/5 lato-regular">
            {productData.description}
          </p>
          <div className="flex flex-col gap-5 my-8">
            {productData.sizes.length === 0 ? "" : <p className="proza-libre-regular">SELECT SIZE</p>}

            <div className="flex gap-5 flex-wrap items-end">
              {productData.sizes.map((item, index) => {
                const isOutOfStock = item.stock === 0;
                const isLowStock = item.stock > 0 && item.stock < 5;

                return (
                  <>
                    <div
                      key={index}
                      className="flex flex-col items-center lato-regular"
                    >
                      <div className="flex flex-col">
                        {isLowStock && (
                          <p className="text-[10px] text-red-500 font-bold mb-1">
                            Only {item.stock} left!
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => !isOutOfStock && setSize(item.size)}
                        disabled={isOutOfStock}
                        className={`py-2 px-4 rounded-sm cursor-pointer 
            ${
              isOutOfStock
                ? "border bg-neutral-200 text-gray-400 cursor-not-allowed"
                : "border"
            }
            ${
              size === item.size && !isOutOfStock
                ? "border border-blue-500 bg-blue-500 text-white"
                : ""
            }
          `}
                      >
                        {item.size}
                      </button>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div className="flex">
            <button
              className="bg-blue-500 rounded-sm text-white px-6 py-3 text-sm transition-colors duration-300 hover:bg-blue-600 cursor-pointer proza-libre-regular flex justify-center items-center"
              onClick={() => addToCart(productData._id, size)}
            >
              <IoCartOutline size={20} />
              <p className="ml-2 mt-1">ADD TO CART</p>
            </button>

            <button
              className="bg-rose-500 ml-5 rounded-sm text-white px-6 py-3 text-sm transition-colors duration-300 hover:bg-rose-600 cursor-pointer proza-libre-regular flex justify-center items-center"
              onClick={() => {
                if (!isWishlisted) addToWishlist(productData._id);
              }}
              disabled={isWishlisted}
            >
              {isWishlisted ? <FaHeart size={17} /> : <FaRegHeart size={17} />}
              <p className="ml-2 mt-1">
                {isWishlisted ? "WISHLISTED" : "ADD TO WISHLIST"}
              </p>
            </button>
          </div>

          <hr className="mt-10 sm:w-4/5" />
          <div className="text-sm mt-6 flex flex-col gap-1">
            <p>100% Original Product</p>
            <p>Cash on delivery availabe</p>
            <p>Easy exchange</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-5 cursor-pointer py-3 border text-md ${
              activeTab === "description" ? "bg-neutral-100" : ""
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 cursor-pointer py-3 border text-md ${
              activeTab === "reviews" ? "bg-neutral-100" : ""
            }`}
          >
            Reviews
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-1 border px-6 py-6 text-sm">
          {activeTab === "description" ? (
            productData.description
          ) : (
            <div>
              <div className="flex items-center gap-1 mb-4"></div>
              {/* Reviews will be mapped here once we have the data */}

              <Reviews />
            </div>
          )}
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      ></RelatedProducts>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
