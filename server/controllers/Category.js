const Category = require("../models/Category");

//create tags
exports.createCategory = async (req, res) => {
    try {
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message: "Name and description are required."
            });
        }
    
        const categoryDetails = await Category.create({name, description})
        console.log(categoryDetails);
    
        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
            data: categoryDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get all tag
exports.showAllCategory = async (req , res) => {
    try {
        const category = await Category.find({} , {name:true, description:true});

        return res.status(200).json({
            success: true,
            message: "Tags fetched successfully",
            data: category
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}