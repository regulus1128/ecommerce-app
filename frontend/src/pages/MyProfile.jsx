import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const MyProfile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({
    name: "",
    email: "",
  });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");



  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/user/get-user-details",
          { withCredentials: true }
        );
        if (response.data.success) {
          setUserDetails(response.data.user);
          setUpdatedDetails({
            name: response.data.user.name || "",
            email: response.data.user.email || "",
          })
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
    // console.log(e.target.value);

  }


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const response = await axios.put(backendUrl + "/api/user/update-user-details", { updatedDetails }, { withCredentials: true });
    console.log(response);
    if(response.data.success){
      toast.success(response.data.message);
    }
    else{
      toast.error(response.data.message)
    }
  }

  return (
    <div className="border-t pt-16">
      <Toaster/>
      <div className="max-w-4xl mx-auto">
        <div className="text-2xl mb-8">
          <Title text1={"PERSONAL"} text2={"INFORMATION"}></Title>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 mt-2">
          <form onSubmit={onSubmitHandler} className="max-w-md mx-auto">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="name"
                id="name"
                className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer lato-regular"
                value={updatedDetails.name}
                onChange={handleUserDetailsChange}
                required
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-md text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-indigo-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 proza-libre-regular"
              >
                Name
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer lato-regular"
                value={updatedDetails.email}
                onChange={handleUserDetailsChange}
                required
              />
              <label
                htmlFor="floating_password"
                className="peer-focus:font-medium absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-indigo-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 proza-libre-regular"
              >
                Email
              </label>
            </div>
            <div className="mt-6 flex justify-center w-full">
              <button
                type="submit"
                className="text-white bg-indigo-500 hover:bg-indigo-600 font-medium rounded-sm text-sm w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer"
              >
                SAVE CHANGES
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
