import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../context/api.js";

const Login = () => {
  axios.defaults.withCredentials=true;
  const navigate = useNavigate();
  
  const {backendUrl,setIsLoggedin,getUserData} = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);
  
  const onSubmitHandler = async (e) => {
    try{
    e.preventDefault();
    axios.defaults.withCredentials=true;
    let response;
    if (state === "Sign Up") {
      response = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
    } else {
      response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
    }

    if (response.data.success) {
      setIsLoggedin(true);
      await getUserData();
      
      const obj = {email,name};
      localStorage.setItem('user-info',JSON.stringify(obj));
      
      toast.success(response.data.message);
      navigate("/");
    } else {
      toast.error(response.data.message || "Something went wrong.");
    }
  }
    catch(err){
      toast.error(err);
    }

  };
  // Flip Animation Variants
  const flipVariants = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { rotateY: -90, opacity: 0, transition: { duration: 0.4 } },
  };

  // Function to toggle login/signup with animation delay
  const toggleState = (newState) => {
    if (isFlipping) return; // Prevents spam clicks
    setIsFlipping(true);
    setTimeout(() => {
      setState(newState);
      setIsFlipping(false);
    }, 100); // Matches animation duration
  };
  
  const responseGoogle = async (authResult) => {
    axios.defaults.withCredentials=true;
    
		try {
			if (authResult["code"]) {
				const result = await googleAuth(authResult.code);
				
        setIsLoggedin(true);
        await getUserData();
        
        const {email, name, image} = result.data.user;
				const token = result.data.token;
				const obj = {email,name, token, image};
				localStorage.setItem('user-info',JSON.stringify(obj));

        toast.success(result.data.message);
				navigate('/');
			} else {
				console.log(authResult);
				throw new Error(authResult);
			}
		} catch (e) {
			console.log('Error while Google Login...', e.message);
		}
	};

	const googleLogin = useGoogleLogin({
    
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: "auth-code",
	});

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-b from-gray-300 to bg-gray-200">
      <Navbar name={state === 'Sign Up' ? "Login" : "Sign Up" } />
      <div className="relative w-full sm:w-96 h-auto flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            variants={flipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute w-full sm:w-96 p-10 rounded-lg shadow-lg text-indigo-300 text-sm bg-slate-900 flex flex-col justify-center items-center"
          >
            <h1 className="text-3xl font-semibold text-white text-center mb-3">
              {state === "Sign Up" ? "Create Account" : "Login"}
            </h1>
            <p className="text-center text-sm mb-6">
              {state === "Sign Up" ? "Create your Account!" : "Login to your Account!"}
            </p>
            <form onSubmit={onSubmitHandler}>
              {state === "Sign Up" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1 }}
                  className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]"
                >
                  <img src={assets.person_icon} alt="user icon" />
                  <input
                    className="bg-transparent outline-none text-white w-full"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="Full Name"
                    required
                  />
                </motion.div>
              )}
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} alt="email icon" />
                <input
                  className="bg-transparent outline-none text-white w-full"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Enter your Email"
                  required
                />
              </div>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} alt="password icon" />
                <input
                  className="bg-transparent outline-none text-white w-full"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {state === "Login" && <p className="mb-4 text-indigo-400 cursor-pointer" onClick={()=>navigate('/reset-password')}>Forgot Password?</p>}
              <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
                {state}
              </button>
              {state === "Sign Up" ? (
                <p className="text-center text-s text-gray-400 mt-4">
                  Already have an account?{" "}
                  <span onClick={() => toggleState("Login")} className="text-indigo-400 cursor-pointer">
                    Login
                  </span>
                </p>
              ) : (
                <p className="text-center text-xs text-gray-400 mt-4">
                  Don&apos;t have an account?{" "}
                  <span onClick={() => toggleState("Sign Up")} className="text-indigo-400 cursor-pointer">
                    Sign Up
                  </span>
                </p>
              )}
            </form>
            <h1 className="text-white p-3">OR</h1>
            <button onClick={googleLogin}>
              <img src={assets.google} alt="Sign in with Google" className="w-55 h-11 rounded-[7px] cursor-pointer"></img>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
