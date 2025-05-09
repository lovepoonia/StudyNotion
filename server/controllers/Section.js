const Section = require("../models/Section");
const Course = require("../models/Course");

//create section
exports.createSection = async (req , res) => {
    try {
        const { name, courseId} = req.body;
        if(!name || !courseId){
            return res.status(400).json({
                success:false,
                message: "Please fill in all fields."
            });
        }

        const newSection = await Section.create({name});

        const updateCoursesDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {courseContent: newSection._id}
            },
            {new:true}
        ).populate("courseContent", ["name" , "subSection"]);

        return res.status(200).json({
            success:true,
            message: "Section created successfully",
            data:updateCoursesDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create section, please try again",
            error:error.message
        })
    }
}

//update section
exports.deleteSection = async (req, res) => {
    try {
        const {name , sectionId} = req.body;
        if(!name || !sectionId){
            return res.status(400).json({
                success:false,
                message: "Please fill in all fields."
            });
        }

        const updateSection = await Section.findByIdAndUpdate(sectionId, {name}, {new:true});

        return res.status(200).json({
            success:true,
            message: "Section update successfully",
            data:updateSection
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again",
            error:error.message
        })
    }
}

// delete section
exports.deleteSection = async (req, res) => {
    try {
        const {sectionId} = req.params;
    
        await Section.findByIdAndDelete(sectionId);
    
        return res.status(200).json({
            success:true,
            message: "Section delete successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again",
            error:error.message
        })
    }
}