import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../model/model.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import transporter from "../config/mailer.js"
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE,WELCOME_TEMPLATE,MESSAGE_TEMPLATE, GOOGLE_TEMPLATE } from "../config/emailTemplates.js";
import axios from 'axios';
import { oauth2Client } from '../utils/googleClient.js';

export const register = async (req,res) => {
    const {name,email,password} = req.body;
    if(!name){
        return res.json({success :false ,message : 'Name is Required !'})
    }
    if(!email){
        return res.json({success :false ,message : 'Email is Required !'})
    }
    if(!password){
        return res.json({success :false ,message : 'Password is Required !'})
    }
    try {

        const existingUser = await userModel.findOne({email});
        if(existingUser) return res.json({success:false, message:'User already registered !'})

        const hashedPassword = await bcrypt.hash(password,7);
        const user = new userModel({name,email,password:hashedPassword});
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_KEY,{expiresIn:'24h'})
        res.cookie('token',token,{
            httpOnly:true,
            secure :process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge:24*60*60*1000
        }) 
        const mailOptions = { 
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Authentication App',
            html: WELCOME_TEMPLATE.replace("{{name}}",user.name).replace("{{email}}",user.email)
            // text: `<p>Welcome ${name},</p> <p>Your account has been successfully credited with $10Million.</p> <p>If not then contact your executive Jhaat Buddhi</p><p>Yours OHH FACK!!</p>`
        }
        await transporter.sendMail(mailOptions);

        return res.json({success:true, message:'User registered successfully !',user})
    } catch (error) {
        return res.json({success:false,message: error.message})
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body;
    if(!email){
        return res.json({success :false ,message : 'Email is Required !'})
    }
    if(!password){
        return res.json({success :false ,message : 'Password is Required !'})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) return res.json({success:false,message:'User not found !'})

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch) return res.json({success:false,message:'Invalid credentials !'})

        const token = jwt.sign({id:user._id},process.env.JWT_KEY,{expiresIn:'24h'})
        res.cookie('token',token,{
            httpOnly:true,
            secure :process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge:24*60*60*1000
        }) 
        return res.json({success:true, message:'User logged in successfully !',user})
    } catch (error) {
        return res.json({success:false,message: error.message})
    }
}

export const logout = async (req,res) => {
    res.clearCookie('token');
    return res.json({success:true,message:'User logged out successfully !'})
}

export const sendVerifyOtp = async (req,res) => {
    try{const {userId} = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
 
    const user = await userModel.findById(userId);

    if(!user) return res.json({success:false,message:'User not found !'})

    if(user.isAccountVerified) return res.json({success:false,message:'Account already verified !'})
    
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 5*60*1000;
    await user.save(); 

    const mailOptions = { 
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Account Verification OTP',
        // text: `Hello ${user.name}, Your OTP for account verification is ${otp}.`
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    }
    await transporter.sendMail(mailOptions);

    res.json({success:true,message:'OTP sent successfully !',userId})
    }
    catch (error) {
        return res.json({success:false,message: error.message})  
    }
}        

export const verifyOtp = async (req,res) => {
    const {userId,otp} = req.body;
    const user = await
    userModel.findById(userId);
    if(!user) return res.json({success:false,message:'User not found !'})
    if(user.isAccountVerified) return res.json({success:false,message:'Account already verified !'})
    if(!user.verifyOtp || !userId || !otp) return res.json({success:false,message:'Invalid request !'})
    try {
        if(user.verifyOtp !== otp || user.verifyOtp ==='') return res.json({success:false,message:'Invalid OTP !'})
        if(user.verifyOtpExpiresAt < Date.now()) return res.json({success:false,message:'OTP expired !'})
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiresAt = 0;
        await user.save();
        return res.json({success:true,message:'Account verified successfully !'})
    }
    catch (error) {
        return res.json({success:false,message: error.message})
    }
}

export const sendResetOtp = async (req,res) => {
    const {email} = req.body;
    if(!email) return res.json({success:false,message:'Email is required !'})
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
    const user = await userModel.findOne({email});
    if(!user) return res.json({success:false,message:'User not found !'})
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 5*60*1000;
    await user.save();

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Reset Password OTP',
        // text: `Hello ${user.name}, Your OTP for password reset is ${otp}.`
        html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    }
    await transporter.sendMail(mailOptions);

    return res.json({success:true,message:'OTP sent successfully !',email})
    }
    catch (error) {
        return res.json({success:false,message: error.message})
    }
}

export const resetPassword = async (req,res) => {
    const {email,newPassword,otp} = req.body;
    if(!email || !newPassword || !otp) return res.json({success:false,message:'Invalid request !'})
    try {
    const user = await userModel.findOne({email});

    if(!user) return res.json({success:false,message:'User not found !'})
    
    if(user.resetOtp !== otp || user.resetOtp === '') return res.json({success:false,message:'Invalid OTP !'})
    if(user.resetOtpExpiresAt < Date.now()) return res.json({success:false,message:'OTP expired !'})
    
    user.password = await bcrypt.hash(newPassword,7);
    user.resetOtp = '';
    user.resetOtpExpiresAt = 0;
    await user.save();
    
    return res.json({success:true,message:'Password reset successfully !'})
    }
    catch (error) {
        return res.json({success:false,message: error.message})
    }
}

export const isAuthenticated = async (req,res) => {
    try{
        return res.json({success:true,isAuthenticated:true,message:'Logged In'})
    }
    catch (error) {
        return res.json({success:false,message: error.message})
    }
}

export const sendMessage = async (req,res) => {
    const {email,message} = req.body;
    
    const mailist=[
        email,
        process.env.SENDER_EMAIL,
    ]
    try{
        const mailOptions = { 
            from: process.env.SENDER_EMAIL,
            to: mailist,
            subject: 'Message from '+ email,
            // text: `Hello ${user.name}, Your OTP for account verification is ${otp}.`
            html: MESSAGE_TEMPLATE.replace("{{message}}",message).replace("{{email}}",email)
        }
        await transporter.sendMail(mailOptions);
    
        res.json({success:true,message:'Message sent successfully !'})
        
    }
    catch (error) {
        return res.json({success:false,message: error.message})
    }
}

/* GET Google Authentication API. */
export const googleAuth = async (req, res) => {
    const code = req.query.code;
    try {
        
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Fetch user info from Google
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
        );
        
        const { email, name, picture } = userRes.data;

        // Check if the user already exists
        let user = await userModel.findOne({ email });
        const existingUser = await userModel.findOne({email});
        if (!user) {
            console.log("New User, Creating Account...");
            user = await userModel.create({
                name,
                email,
                password: null, // No password for Google users
                isAccountVerified:true,
                image: picture,
            });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '24h' });

        // Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        if(!existingUser) {

        // Send Welcome Email
            const mailOptions = { 
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Welcome to Authentication App',
                html: GOOGLE_TEMPLATE.replace("{{name}}",user.name).replace("{{email}}",user.email)
                // text: `<p>Welcome ${name},</p> <p>Your account has been successfully credited with $10Million.</p> <p>If not then contact your executive Jhaat Buddhi</p><p>Yours OHH FACK!!</p>`
            }
            await transporter.sendMail(mailOptions);
        }
        return res.json({ success: true, message: 'User logged in successfully!', user });

    } catch (err) {
        console.error("Google Auth Error:", err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
