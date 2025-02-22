import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    verifyOtp:{
        type: String,
        default:'',
    },
    verifyOtpExpiresAt:{
        type: Number,
        default:0,
    },
    resetOtp:{
        type: String,
        default:'',
    },
    resetOtpExpiresAt:{
        type: Number,
        default:0,
    },
    isAccountVerified:{
        type:Boolean,
        default: false,
    }
})

const userModel=mongoose.model('Users',userSchema)

export default userModel;
