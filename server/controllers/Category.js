const Category = require("../models/Category");

//create category
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
            message: "Categorys created successfully",
            data: categoryDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get all category
exports.showAllCategory = async (req , res) => {	
    try {
        const category = await Category.find({} , {name:true, description:true});

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//category page details
exports.categoryPageDetails = async (req, res) => {
	try {
		const { categoryId } = req.body;

		// Get courses for the specified category
		const selectedCategory = await Category.findById(categoryId)
			.populate("courses")
			.exec();
		console.log(selectedCategory);
		// Handle the case when the category is not found
		if (!selectedCategory) {
			console.log("Category not found.");
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}
		// Handle the case when there are no courses
		if (selectedCategory.course.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		const selectedCourses = selectedCategory.course;

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		}).populate("courses").exec();
		let differentCourses = [];
		for (const category of categoriesExceptSelected) {
			differentCourses.push(...category.course);
		}

		// Get top-selling courses across all categories
		const allCategories = await Category.find().populate("courses");
		const allCourses = allCategories.flatMap((category) => category.courses);
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);

		res.status(200).json({
			selectedCourses: selectedCourses,
			differentCourses: differentCourses,
			mostSellingCourses: mostSellingCourses,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};