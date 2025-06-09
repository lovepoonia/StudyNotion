const jwt = require('jsonwebtoken');

//auth
exports.auth = async (req,res,next) => {
   try {
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","");
        
        // if token missing, then return responce
        if(!token){
            return res.status(401).json({
                success:false,
                error: "Unauthorized",
                message: "Please login to access this resource token not found"
            });
        }
        //verify the token
        try {
            const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(verifyToken);
            req.user = verifyToken;
        } catch (error) {
            return res.status(401).json({
                success:false,
                error: "Unauthorized",
                message: "Please login to access this resource"
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            error: "Unauthorized",
            message: "Something went wrong while authenticating"
        })
   }
}

// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                error: "Unauthorized",
                message: "You are not a student"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "User role cannot be verified, please try again"
        })
    }
}

// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                error: "Unauthorized",
                message: "You are not a Instructor"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "User role cannot be verified, please try again"
        })
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                error: "Unauthorized",
                message: "You are not a Admin"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "User role cannot be verified, please try again"
        })
    }
}