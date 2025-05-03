import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyProfile from "./pages/MyProfile";
import Verify from "./pages/Verify";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";
import AddReview from "./pages/AddReview";
import MyReviews from "./pages/MyReviews";
import EditReview from "./pages/EditReview";
import MyWishlist from "./pages/MyWishlist";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        // transition={Slide}
      />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/add-review/:productId" element={<AddReview />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/edit-review/:productId" element={<EditReview />} />
        <Route path="/my-wishlist" element={<MyWishlist />} />
        
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
