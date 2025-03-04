import React, { use, useContext, useEffect } from 'react'
import {assets} from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import PropTypes from 'prop-types';

const Navbar = ({name="Login"}) => {

  const navigate = useNavigate()
  const{userData,backendUrl,setUserData,setIsLoggedin,isLoggedin} =useContext(AppContent);
  
  const sendVerificationOtp= async()=>{
    try{
      axios.defaults.withCredentials=true;
      const{data}= await axios.post(backendUrl+'/api/auth/send-verify-otp')
      if(data.success){
        navigate('/verify-email')
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    }catch(e){
    toast.error(e.message);
  }
  }
  

  const logout = async()=>{
    try{
      axios.defaults.withCredentials=true;
      const{data} = await axios.post(backendUrl+'/api/auth/logout');
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      localStorage.removeItem('user-info');
      toast.success(data.message)
      navigate('/')
    }
    catch(error){
      toast.error(error.message);
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 left-0 shadow-md'>
      
      <img onClick={()=>{navigate('/')}} src={assets.logo} alt="logo" className='w-28 sm:w-32'/>
      {userData ? 
      <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
        {userData.image ?<img src={userData.image} alt={userData.name[0].toUpperCase()} className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"/> : userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-1 right-0 z-10 text-black rounded pt-10'>
              <ul className='list-none m-0 p-2 bg-gray-100 text-sm text-center'>
              <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>{userData.email}{userData.isAccountVerified ? "✅" : "❌" }</li>

                {!userData.isAccountVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer whitespace-nowrap' onClick={sendVerificationOtp}>Verify email 🚀</li>}
                
                <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={logout}>Logout</li>
              </ul>
            </div>   
      </div>
      :
      <button onClick={()=>{navigate('/login')}} 
      className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
        {name} 
        <img src={assets.arrow_icon} /></button>
    }</div>
  )
}
Navbar.propTypes = {
  name: PropTypes.string,  
};
export default Navbar
