const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*5,
    }
})

//a function -> to send email
async function sendVerficationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "Verification Email from StudyNation", emailTemplate(otp));
        console.log("Email send successful: ", mailResponse);
        
    } catch (error) {
        console.log("Error Occur in sending verification email: ", error);
        throw error;
    }
}

otpSchema.pre("save" , async function(next){
    await sendVerficationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema);