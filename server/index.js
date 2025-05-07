const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const app = express();

connectDB().then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () => {
        console.log(``);
    });
}).catch((err) => {
    console.log(err.message);
    console.log("connection fail");
    
})