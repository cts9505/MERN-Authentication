import './index.css'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FooterContainer } from './components/footer'

function App() {
  return (
    <div>
      <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<EmailVerify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
    <FooterContainer/>
    </div>
  )
}

export default App
