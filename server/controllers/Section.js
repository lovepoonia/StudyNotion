const Section = require("../models/Section");
const Course = require("../models/Course");

//create section
exports.createSection = async (req , res) => {
    try {
        const { sectionName , courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message: "Please fill in all fields."
            });
        }

        const newSection = await Section.create({sectionName});

        const updateCoursesDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {courseContent: newSection._id}
            },
            {new:true}
        ).populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

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
exports.updateSection = async (req, res) => {
    try {
        const {sectionName, sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message: "Please fill in all fields."
            });
        }

        const updateSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

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
        const {sectionId} = req.body;
    
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