import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Add from '../pages/Add';
import List from '../pages/List';
import Orders from '../pages/Orders';
import { Routes, Route } from 'react-router-dom';

const Home = ({ isAuthenticated }) => {
  return (
    <>
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-base">
          <Routes>
            <Route path="/" element={<h1>Welcome to Admin Dashboard</h1>} />
            <Route path="add" element={<Add isAuthenticated={isAuthenticated}/>} />
            <Route path="list" element={<List />} />
            <Route path="orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Home;
