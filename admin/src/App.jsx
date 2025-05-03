import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./components/Home";
import axios from "axios";
import Edit from "./pages/Edit";

export const backendURL = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(backendURL + '/api/user/verify', {
          withCredentials: true,
        });

        console.log(response.data);

        if(response.data.success){
          setIsAuthenticated(true);
          navigate('/home');
        } else{
          setIsAuthenticated(false);
          navigate("/");
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/");
      }
    };
    verifyUser();
  }, []);

  return (
    <div className="min-h-screen">
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
        <Route path="/home/*" element={isAuthenticated ? <Home isAuthenticated={isAuthenticated}/> : <Navigate to="/" />} />
        <Route path="/edit/:id" element={<Edit/>} />
      </Routes>
    </div>
  );
};

export default App;
