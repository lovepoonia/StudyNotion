const Tag = require("../models/Tag");

//create tags
exports.createTag = async (req, res) => {
    try {
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message: "Name and description are required."
            });
        }
    
        const tagDetails = await Tag.create({name, description})
        console.log(tagDetails);
    
        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
            data: tagDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get all tag
exports.showAllTags = async (req , res) => {
    try {
        const tags = await Tag.find({} , {name:true, description:true});

        return res.status(200).json({
            success: true,
            message: "Tags fetched successfully",
            data: tags
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}