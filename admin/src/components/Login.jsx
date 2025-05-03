import React, { useState } from 'react'
import { backendURL } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Add from '../pages/Add';

const Login = ({ setIsAuthenticated }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendURL + '/api/user/admin', { email, password }, { withCredentials: true });
            console.log(response);

            if(response.data.success){
                console.log(response.data);
                toast.success("Login Successful!");
                setToken(response.data.token);
                <Add token={token}/>
                setIsAuthenticated(true);
                navigate('/home');
            }
            else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);

        }
    }
  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
        <div className='bg-white shadow-md rounded-sm px-6 py-6 max-w-md'>
            <h1 className='text-2xl mb-4 proza-libre-regular'>Admin Panel</h1>
            <form onSubmit={onSubmitHandler}>
                <div className='mb-3 min-w-72'>
                    <p className='text-md font-medium mb-2 lato-regular'>Email Address</p>
                    <input className='rounded-sm w-full px-3 py-2 border border-neutral-300 outline-none lato-regular' type="email" name="" id="" placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} value={email} required/>
                </div>

                <div className='mb-3 min-w-72'>
                    <p className='text-md font-medium mb-2 lato-regular'>Password</p>
                    <input className='rounded-sm w-full px-3 py-2 border border-neutral-300 outline-none lato-regular' type="password" name="" id="" placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} value={password} required/>
                </div>
                <button type='submit' className='mt-2 w-full py-2 px-4 text-white bg-indigo-600 rounded-sm proza-libre-regular hover:bg-indigo-700 cursor-pointer'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login