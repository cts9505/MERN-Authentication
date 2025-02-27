import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {  
    axios.defaults.withCredentials = true;
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState();
    
    useEffect(() => {
        checkAuthWithServer();
    }, []);
    
    const checkAuthWithServer = async () => {
        try {
            // This will automatically send cookies due to withCredentials=true
            const response = await axios.post(backendUrl + '/api/auth/is-auth');
            console.log("Auth check response:", response.data);
            
            if (response.data.success) {
                setIsLoggedin(true);
                getUserData();
            } else {
                setIsLoggedin(false);
                toast.warn('Login to access all features!',{ autoClose: 1200 });
            }
        } catch (error) {
            console.error("Auth check error:", error);
            setIsLoggedin(false);
            
            // Only show toast if it's not a 401 error (which is expected when logged out)
            if (!error.response || error.response.status !== 401) {
                toast.error("Error checking authentication status");
            } else {
                toast.warn('Login to access all features!',{ autoClose: 1200 });
            }
        }
    };
    
    const getUserData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/user/get-data');
            if (response.data.success) {
                setUserData(response.data.userData);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Get user data error:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };
    
    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData
    };
    
    return (
        <AppContent.Provider value={value}>
            {children}  
        </AppContent.Provider>
    );
};