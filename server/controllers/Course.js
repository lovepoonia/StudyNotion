const User = require("../models/User");
const Tag = require("../models/Tag");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploder");


//create course
exports.createCourse = async (req , res) => {
    try {
        const {courseName , courseDescription, language, whatYouWillLearn, price , tag} = req.body;
        const thumbnail = req.files.thumbnailImage;
    
        if(!courseName || !courseDescription || !language || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
              })
        }
    
        const userId = res.user._id;
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails) {
            return res.status(404).json({
              success: false,
              message: "Instructor Details Not Found",
            })
        }
    
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            return res.status(404).json({
              success: false,
              message: "Tag Details Not Found",
            })
        }
    
        const thumbnailImage = await uploadImageToCloudinary(thumbnail , process.env.FOLDER_NAME);
    
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag : tagDetails._id,
            language,
            thumbnail: thumbnailImage.secure_url,
        })
    
        await User.findByIdAndUpdate(
            {
              _id: instructorDetails._id,
            },
            {
              $push: {
                courses: newCourse._id,
              },
            },
            { new: true }
        )
    
        await Tag.findByIdAndUpdate(
            { _id: tag },
            {
              $push: {
                courses: newCourse._id,
              },
            },
            { new: true }
          )
    
        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: error.message,
        })
    }
}

//get all courses
exports.showAllCourses = async (req , res) => {
   try {
        const allCourses = await Course.find({} ,
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
            }
        );
        res.status(200).json({
            success: true,
            data: allCourses,
        })
   } catch (error) {
    console.log(error)
    return res.status(404).json({
    success: false,
    message: `Can't Fetch Course Data`,
    error: error.message,
    })
   }
}