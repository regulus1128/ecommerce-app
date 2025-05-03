import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import ReactStars from "react-stars";
import { Link } from "react-router-dom";


const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { backendUrl } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/review/get-review`, {
        withCredentials: true,
      });
      console.log("response in my reviws: ", response);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, []);

  if(loading) return <h1 className="text-center lato-regular text-2xl mt-4">Loading...</h1>

  return (
    <div>
      <div className="text-2xl mb-8 mt-10">
        <Title text1={"MY"} text2={"REVIEWS"}></Title>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          You haven't posted any reviews yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-8">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-start gap-4">
                {review.product.image && (
                  <img
                    src={review.product.image[0]}
                    alt={review.product.name}
                    className="w-20 h-20 object-cover rounded-sm"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2 proza-libre-regular">
                    {review.product.name}
                  </h3>
                  <hr />
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={20}
                        edit={false}
                      />
                    </div>
                    <span className="ml-2 mt-1 text-sm text-gray-600 lato-regular">
                      ({review.rating}/5)
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2 lato-regular">{review.comment}</p>
                  <p className="text-sm text-gray-400 lato-regular">
                    Posted on: {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-end">
                    <Link to={`/edit-review/${review.product._id}`} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 cursor-pointer transition-colors duration-300 rounded-sm text-white text-sm font-bold proza-libre-regular">
                      Edit Your Review
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
