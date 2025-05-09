const Profile = require("../models/Profile");
const User = require("../models/User");


//update profile
exports.updateProfile = async (req, res) => {
    try {
        const {dateOfBirth, gender, about, contactNumber} = req.body;
        const id = req.user.id;
        
        const userDetail = await User.findById(id);
        const profileId = userDetail.additionalDetails;
        
        const profile = await Profile.findById(profileId);
        
        profile.dateOfBirth = dateOfBirth;
        profile.gender = gender;
        profile.about = about;
        profile.contactNumber = contactNumber;
        await profile.save();
        
        res.status(200).json({
            success:true,
            message: "Profile updated successfully",
            profile
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error updating profile"
        });
    }
}

// delete account
exports.deleteAccount = async (req, res) => {
    try {
        const id =req.user.id;
        const userDetail = await User.findById(id);
        if(!userDetail){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        await Profile.findByIdAndDelete({_id:userDetail.additionalDetails})
        await User.findByIdAndDelete({_id : id});
        
        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting profile"
        });
    }
}

// get all details
exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetail = await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            userDetail
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching user details"
        });
    }
}