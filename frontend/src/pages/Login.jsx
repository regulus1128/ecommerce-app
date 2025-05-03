import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

const Login = () => {

  const [currentState, setCurrentState] = useState('Sign Up');
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    try {

      if(currentState === 'Sign Up'){

        if (!email || email.trim() === "") {
          toast.error("Email is required!");
          return;
        }
        if (!validator.isEmail(email)) {
          toast.error("Invalid email format!");
          return;
        }
        if (!password || password.trim() === "") {
          toast.error("Password is required!");
          return;
        }

        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password }, { withCredentials: true });
        console.log(response);
        if(response.data.success){
          setToken(response.data.token);
          // set cookie here
          navigate('/login');
          toast.success(response.data.message);

        } else{
          toast.error(response.data.message);
      }

      } else { // if the current state is login
        if (!email || email.trim() === "") {
          toast.error("Email is required!");
          return;
        }
        if (!validator.isEmail(email)) {
          toast.error("Invalid email format!");
          return;
        }
        if (!password || password.trim() === "") {
          toast.error("Password is required!");
          return;
        }
        const response = await axios.post(backendUrl + '/api/user/login', { email, password }, { withCredentials: true });
        console.log(response);
        if(response.data.success){
          setToken(response.data.token);
          toast.success(response.data.message);
          navigate('/');
        } else{
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(token){
      navigate('/');
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
      <Toaster />
        <p className='proza-libre-regular text-3xl'>{currentState}</p>
      </div>
      {currentState === 'Login' ? '' : <input onChange={(e) =>setName(e.target.value)} value={name} type="text" name="" id="" className='w-full px-3 py-2 border rounded-sm border-neutral-500' placeholder='Name' required/>}

      <input type="email" onChange={(e) =>setEmail(e.target.value)} value={email} name="" id="" className='w-full px-3 py-2 border border-neutral-500 rounded-sm lato-regular' placeholder='Email' required/>

      <input type="password" onChange={(e) =>setPassword(e.target.value)} value={password} name="" id="" className='w-full px-3 py-2 border border-neutral-500 rounded-sm lato-regular' placeholder='Password' required/>

      
      <button className='bg-blue-500 text-white font-medium px-8 py-2 mt-4 rounded-sm cursor-pointer hover:bg-blue-600'>{currentState === 'Login' ? 'LOGIN' : 'SIGN UP'}</button>
      <div className='mt-2 flex flex-row'>
      {
          currentState === 'Login'
          ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer lato-regular text-[17px] hover:text-blue-600'>New here? Click here to sign up.</p>
          : <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-[17px] lato-regular hover:text-blue-600'>Already have an account? Click here to login.</p>
      }
      </div>


    </form>
  )
}

export default Login