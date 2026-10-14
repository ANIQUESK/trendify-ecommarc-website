import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const {token,setToken,navigate,backendUrl}=useContext(ShopContext);
  const [name,setName]= useState('');
  const [password,setPassword]= useState('');
  const [email,setEmail]= useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Simple client-side validation check
    if ((currentState === 'Sign Up' && !name) || !email || !password) {
        toast.error("Please fill in all required fields.");
        return;
    }
    
    try {
      let response;
      if (currentState === 'Sign Up') {
        response = await axios.post(
          `${backendUrl}/api/user/register`,
          { name, email, password },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        response = await axios.post(
          `${backendUrl}/api/user/login`,
          {email, password }
        );
      }

      // **CRITICAL FIX**: Check the backend's explicit 'success' flag
      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem('token',response.data.token)
        // Optionally navigate immediately on success, though useEffect handles this
        // navigate('/'); 
      }
      else {
        // Handle application-specific errors returned by the server (e.g., user not found, invalid password)
        toast.error(response.data.message || "An unknown error occurred during authentication.");
      }

    } catch (error) {
      // Handle network errors (e.g., server down, connection failed)
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
         toast.error(error.response.data.message);
      } else {
         toast.error("Network or server error. Please try again.");
      }
    }
  };
  
  // This useEffect ensures navigation happens automatically when the token is successfully set
  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token])
  
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input onChange={(e)=>setName(e.target.value)} value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="John Doe"
          required
        />
      )}
      <input onChange={(e)=>setEmail(e.target.value)} value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="hello@gmail.com"
        required
      />
      <input onChange={(e)=>setPassword(e.target.value)} value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />
      <div className="flex justify-between w-full text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create a new account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login here
          </p>
        )}
      </div>
      <button type="submit" className="px-8 py-2 mt-4 font-light text-white bg-black">{currentState === "Login" ? "Sign In" : "Sign Up"}</button>
    </form>
  );
};

export default Login;