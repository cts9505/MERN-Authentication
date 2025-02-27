import express from "express";
import { register, login, logout ,sendVerifyOtp,verifyOtp, sendResetOtp,resetPassword, isAuthenticated, sendMessage} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verify-otp",userAuth, sendVerifyOtp);
router.post("/verify-otp",userAuth, verifyOtp);
router.post("/send-reset-otp",sendResetOtp);
router.post("/reset-password",resetPassword);
router.post("/is-auth",userAuth,isAuthenticated);
router.post("/send-message",sendMessage)
export default router;