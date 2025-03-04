import { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useState } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useRef } from 'react';

const EmailVerify = () => {
  axios.defaults.withCredentials=true;
  const navigate=useNavigate();
  const firstRender = useRef(true);
  const [otp, setOtp] = useState('');

  const { backendUrl, isLoggedin, userData, getUserData, loading } = useContext(AppContent);

  useEffect(() => {
    if(isLoggedin){if (firstRender.current) {
      firstRender.current = false; // ✅ Skip the first render
      return;
    }
    if (loading) return;
  } // ✅ Prevent running during loading

    if (!isLoggedin || !userData) {  // ✅ Double-check both states
        toast.error('Please Login to Verify Account!');
        navigate('/login');
    } else if (userData?.isAccountVerified) {
        toast.success('Account already Verified!', { autoClose: 1000 });
        navigate('/')
    }

}, [isLoggedin, userData, loading]); 
  
  const handleChange = (e) => {
    let value = e.target.value;
    if (value.length > 6) return; 
    setOtp(value);
  };

  const onSubmitHandler = async(e)=>{
    try{
      e.preventDefault();
      const{data}= await axios.post(backendUrl+'/api/auth/verify-otp',{otp})
      if(data.success){
        await getUserData();
        toast.success(data.message)
        navigate('/')
      }else{
        toast.error(data.message)
      }
    }
    catch(error){
      toast.error(error.message)
    }
  }
  
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-gray-50 to bg-gray-100'>
      <Navbar/>
       <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className='text-center mb-4 font-semibold text-3xl text-white w-full '>
            Account Verify OTP
          </h1>
          <p className='text-center mb-6 text-indigo-300'>
            Enter the 6-digit code sent to your email.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img className='h-5 w-6' src={assets.otp_icon} alt="otp icon" />
            <input
            type="text"
            value={otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            className="bg-transparent outline-none text-white"
            maxLength={6}
            minLength={6}
            inputMode="numeric"
            style={{
              letterSpacing: otp ? "1.2em" : "normal", // Spacing only when user types
            }}
            required
          />
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify Otp</button>
        </form>
        </div>
  )
}

export default EmailVerify
