import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ReactStars from "react-stars";


const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { productId } = useParams();
  const { backendUrl } = useContext(ShopContext);

  const fetchReviews = async () => {
    const response = await axios.get(
      `${backendUrl}/api/review/product/${productId}/get-all-reviews`,
    );
    if (response.data.success) {
      setReviews(response.data.reviews);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);
  return (
    <div>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl mt-2 font-semibold text-gray-800 lato-regular">
                {review.user.name}
              </h2>
              <div className="text-yellow-500 text-sm lato-regular">
              <ReactStars
              count={5}
              value={review.rating} // Example: 4.2
              size={18}
              edit={false}
              color2={"#ffd700"} // Star color
            />
              </div>
            </div>
            <p className="text-gray-700 mb-2 lato-regular">{review.comment}</p>
            <p className="text-sm text-gray-600 lato-regular">
              Posted on {new Date(review.createdAt).toLocaleDateString()}
            </p>
            <hr className="mt-2"/>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;
