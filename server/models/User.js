const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin","Student", "Instructor"],
    },
    active: {
        type: Boolean,
        default: true,
	},
	approved: {
        type: Boolean,
        default: true,
	},
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ],
    image:{
        type:String,
        default:"https://pinnacle.works/wp-content/uploads/2022/06/dummy-image.jpg"
    },
    token:{
        type:String
    },
    resetPasswordExpires :{
        type:Date
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress"
        }
    ]
})

module.exports = mongoose.model("User", userSchema);