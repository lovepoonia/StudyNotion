const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
        required:true,
        enum:["Male","Female","Other"]
    },
    dateOfBirth:{
        type:Date,
    },
    about:{
        type:String,
        trim:true
    },
    contactNumber:{
        type:String,
        trim:true
    }
})

module.exports = mongoose.model("Profile",profileSchema);