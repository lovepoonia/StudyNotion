const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

//reset password token
exports.resetPasswordToken = async (req , res) => {
   try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                msg: "User not found"
            })
        } 
    
        const token = crypto.randomBytes(20).toString("hex");
    
        const updatedDetail = await User.findOneAndUpdate(
            {email} ,
            {token,
                resetPasswordExpires : Date.now() + 3600000,
            },
            {new:true}
        )
        console.log(updatedDetail)
        const url = `http://localhost:3000/update-password/${token}`
    
        await mailSender(email , "Password Reset Link", `Password reset link is here ${url}`)   
    
        return res.status(200).json({
            success:true,
            msg: "Password reset link sent to your email"
        })
   } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            msg: "Internal server error while sending the reset password link"
        })
   }    
}

// reset password
exports.resetPassword = async (req , res) => {
    try {
        const {password, confirmPassword, token} = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                msg: "Password and confirm password do not match"
            })
        }

        const userDetail = await User.findOne({token});
        if(!userDetail){
            return res.status(404).json({
                success:false,
                msg: "User not found"
            })
        }

        if(!(userDetail.resetPasswordExpires> Date.now())){
            return res.status(400).json({
                success:false,
                msg: "Password reset link has expired"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            {token:token},
            {password:hashPassword},
            {new:true}
        )
        
        return res.status(200).json({
            success:true,
            msg: "Password reset successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            msg: "Internal server error while sending the reset password link"
        })
    }
}
