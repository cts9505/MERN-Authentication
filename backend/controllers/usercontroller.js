import userModel from "../model/model.js";

export const getUserData = async (req, res) => {
     try {
        const {userId}=req.body;

        const user = await userModel.findById(userId);
        if(!user) return res.json({success:false,message:'User not found !'})
        return res.status(200).json({success:true, userData:{
            name:user.name,
            email:user.email,
            isAccountVerified:user.isAccountVerified,
            image:user.image,
        }})
        }
        catch (error) {
            return res.status(500).json({success:false,message: error.message})
        }
}

