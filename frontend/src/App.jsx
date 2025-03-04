import './index.css'
import { Routes,Route,Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FooterContainer } from './components/Footer'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from 'react';
import RefreshHandler from './context/RefreshHandler';
import NotFound from './pages/NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
	const GoogleWrapper = ()=>(
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<Login></Login>
		</GoogleOAuthProvider>
	)

  return (
    <div>
      <ToastContainer />
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<GoogleWrapper />} />
      <Route path="/verify-email" element={<EmailVerify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
    <FooterContainer/>
    </div>
  )
}

export default App
