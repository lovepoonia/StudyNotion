const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");

//send otp
exports.sendOTP = async (req, res) =>{
    try {
        const {email} = req.body;
        
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                success:false,
                message:"user already exist. Please login!!!"
            })
        }

        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("Generate otp",otp);
        let result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            result = await OTP.findOne({otp:otp});
        }
        const otpBody = await OTP.create({email, otp})
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:"OTP send successfully",
            otp:otp
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })   
    }
}

//sign up
exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,otp
        } = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields"
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password does not match"
            })
        }

        const exitUser = await User.findOne({email});
        if(exitUser){
            return res.status(400).json({
                success:false,
                message:"Email already exists. Please login!!!"
            })
        }

        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        if(recentOtp && recentOtp.length === 0){
            return res.status(400).json({
                success:false,
                message:"OTP NOT FOUND"
            })
        } else if(otp !== recentOtp[0]?.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const profileDetail = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user =await User.create({
            firstName,
            lastName,
            email,
            password:hashPassword,
            additionalDetails : profileDetail._id,
            accountType,
            contactNumber,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })    

        res.status(200).json({
            success:true,
            message:"User created successfully",
            user:user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `fill ${error.message}`
        })
    }
}

//login
exports.login = async (req, res) =>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"Please enter both email and password"
            })
        }

        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if(isValidPassword){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token = jwt.sign(payload, process.env.SECRET_KEY,{
                expiresIn:"24h"
            })
            user.token = token;
            user.password = undefined;
    
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "Logged in successfully",
                user: user,
                token
            })
        } else {
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// change password
exports.changePassword = async (req, res) =>{
    try {
        const userDetail = await User.findById(req.user.id);
        const {oldPassword, newPassword, confirmPassword} = req.body;

        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            })
        }

        const isValidPassword = await bcrypt.compare(oldPassword, userDetail.password);
        if(!isValidPassword){
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match"
            })
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: hashPassword },
            { new: true }
        )

        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                  updatedUserDetails.email,
                  `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
              )
              console.log("Email sent successfully:", emailResponse.response)
        } catch (error) {
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (error) {
        console.error("Error occurred while updating password:", error)
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        })
    }
}