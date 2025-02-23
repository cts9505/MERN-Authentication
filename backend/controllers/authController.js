import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../model/model.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import transporter from "../config/mailer.js"

export const register = async (req,res) => {
    const {name,email,password} = req.body;
    if(!name){
        return res.status(401).json({success :false ,message : 'Name is Required !'})
    }
    if(!email){
        return res.status(401).json({success :false ,message : 'Email is Required !'})
    }
    if(!password){
        return res.status(401).json({success :false ,message : 'Password is Required !'})
    }
    try {

        const existingUser = await userModel.findOne({email});
        if(existingUser) return res.status(405).json({success:false, message:'User already registered !'})

        const hashedPassword = await bcrypt.hash(password,7);
        const user = new userModel({name,email,password:hashedPassword});
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_KEY,{expiresIn:'24h'})
        res.cookie('token',token,{
            httpOnly:true,
            secure :process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none':'strict',
            maxAge:24*60*60*1000
        }) 
        const mailOptions = { 
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Stake.bet',
            text: `<p>Welcome ${name},</p> <p>Your account has been successfully credited with $10Million.</p> <p>If not then contact your executive Jhaat Buddhi</p><p>Yours OHH FACK!!</p>`
        }
        await transporter.sendMail(mailOptions);

        return res.status(201).json({success:true, message:'User registered successfully !',user})
    } catch (error) {
        return res.status(500).json({success:false,message: error.message})
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body;
    if(!email){
        return res.status(401).json({success :false ,message : 'Email is Required !'})
    }
    if(!password){
        return res.status(401).json({success :false ,message : 'Password is Required !'})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) return res.status(404).json({success:false,message:'User not found !'})

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch) return res.status(400).json({success:false,message:'Invalid credentials !'})

        const token = jwt.sign({id:user._id},process.env.JWT_KEY,{expiresIn:'24h'})
        res.cookie('token',token,{
            httpOnly:true,
            secure :process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none':'strict',
            maxAge:24*60*60*1000
        }) 
        return res.status(200).json({success:true, message:'User logged in successfully !',user})
    } catch (error) {
        return res.status(500).json({success:false,message: error.message})
    }
}

export const logout = async (req,res) => {
    res.clearCookie('token');
    return res.status(200).json({success:true,message:'User logged out successfully !'})
}

export const sendVerifyOtp = async (req,res) => {
    try{const {userId} = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
 
    const user = await userModel.findById(userId);

    if(!user) return res.status(404).json({success:false,message:'User not found !'})

    if(user.isAccountVerified) return res.status(400).json({success:false,message:'Account already verified !'})
    
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 5*60*1000;
    await user.save(); 

    const mailOptions = { 
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Account Verification OTP',
        text: `Hello ${user.name}, Your OTP for account verification is ${otp}.`
    }
    await transporter.sendMail(mailOptions);

    res.status(200).json({success:true,message:'OTP sent successfully !',userId})
    }
    catch (error) {
        return res.status(500).json({success:false,message: error.message})  
    }
}        

export const verifyOtp = async (req,res) => {
    const {userId,otp} = req.body;
    const user = await
    userModel.findById(userId);
    if(!user) return res.status(404).json({success:false,message:'User not found !'})
    if(user.isAccountVerified) return res.status(400).json({success:false,message:'Account already verified !'})
    if(!user.verifyOtp || !userId || !otp) return res.status(400).json({success:false,message:'Invalid request !'})
    try {
        if(user.verifyOtp !== otp || user.verifyOtp ==='') return res.status(400).json({success:false,message:'Invalid OTP !'})
        if(user.verifyOtpExpiresAt < Date.now()) return res.status(400).json({success:false,message:'OTP expired !'})
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiresAt = 0;
        await user.save();
        return res.status(200).json({success:true,message:'Account verified successfully !'})
    }
    catch (error) {
        return res.status(500).json({success:false,message: error.message})
    }
}

export const sendResetOtp = async (req,res) => {
    const {email} = req.body;
    if(!email) return res.status(400).json({success:false,message:'Email is required !'})
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
    const user = await userModel.findOne({email});
    if(!user) return res.status(404).json({success:false,message:'User not found !'})
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 5*60*1000;
    await user.save();

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Reset Password OTP',
        text: `Hello ${user.name}, Your OTP for password reset is ${otp}.`
    }
    await transporter.sendMail(mailOptions);

    return res.status(200).json({success:true,message:'OTP sent successfully !',email})
    }
    catch (error) {
        return res.status(500).json({success:false,message: error.message})
    }
}

export const resetPassword = async (req,res) => {
    const {email,newPassword,otp} = req.body;
    if(!email || !newPassword || !otp) return res.status(400).json({success:false,message:'Invalid request !'})
    try {
    const user = await userModel.findOne({email});

    if(!user) return res.status(404).json({success:false,message:'User not found !'})
    
    if(user.resetOtp !== otp || user.resetOtp === '') return res.status(400).json({success:false,message:'Invalid OTP !'})
    if(user.resetOtpExpiresAt < Date.now()) return res.status(400).json({success:false,message:'OTP expired !'})
    
    user.password = await bcrypt.hash(newPassword,7);
    user.resetOtp = '';
    user.resetOtpExpiresAt = 0;
    await user.save();
    
    return res.status(200).json({success:true,message:'Password reset successfully !'})
    }
    catch (error) {
        return res.status(500).json({success:false,message: error.message})
    }
}
