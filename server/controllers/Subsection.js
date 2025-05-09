const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploder");



// create subsection
exports.createSubSection = async (req, res) => {
    try {
        const {sectionId, title, timeDuration , description} = req.body;
        const video = req.files.videoFile;
        if(!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({ 
                success:false,
                message: "Please fill all the fields" 
            });
        }
        const videoUplodeDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        const subSectionDetails = await SubSection.create({
            title, timeDuration , description, video: videoUplodeDetails.secure_url
        })

        const updateSectionDetail = await Section.findByIdAndUpdate(
            sectionId,
            { $push: { subSections: subSectionDetails._id } },
            { new: true }
        ).populate("Section", ["name" , "subSection"]);

        return res.status(200).json({
            success:true,
            message: "SubSection created successfully",
            data:updateSectionDetail
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create subsection, please try again",
            error:error.message
        })
    }
}

// update subSection
exports.updateSubSection = async (req , res) => {
    try {
        const {subSectionId, title, timeDuration , description} = req.body;
        const video = req.files.videoFile;
        if(!subSectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({ 
                success:false,
                message: "Please fill all the fields" 
            });
        }
        const videoUplodeDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        const subSectionDetails = await SubSection.findByIdAndUpdate(
            subSectionId,
            {
                title, timeDuration , description, video: videoUplodeDetails.secure_url
            },
            { new: true }
        ).populate("Section", ["name" , "subSection"]);
        return res.status(200).json({
            success:true,
            message: "SubSection updated successfully",
            data:subSectionDetails
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update subsection, please try again",
            error:error.message
        })
    }
}

//  delete subsection
exports.deleteSubSection = async (req, res) => {
   try {
        const {subSectionId} = req.params;

        await SubSection.findByIdAndDelete(subSectionId);
       
        return res.status(200).json({
            success:true,
            message: "SubSection deleted successfully",
        })
   } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete subsection, please try again",
            error:error.message
        })
    }
}

