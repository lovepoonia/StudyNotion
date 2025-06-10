const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload")


const PORT = process.env.PORT || 7000;

const userRoutes = require("./routes/User");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const profileRoutes = require("./routes/Profile");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,

}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 },
}));

connectDB().then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err.message);
    console.log("connection fail");
    
})

cloudinaryConnect();
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/profile", profileRoutes);

app.get("/", (req, res) =>{
    return res.json({ message: "Your Server is running" })
});