import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import express from "express"
import app from "./src/app.js"

dotenv.config();

const connectDB = async () =>{
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, //used to parse url string
        useUnifiedTopology: true //used to use new server discovery and monitoring engine
    }).
    then(()=>{
        console.log("database connected")
    }).catch((error)=>{
        console.log("database connection failed",error.message)
    })
}

const PORT = process.env.PORT || 5000;

//MIDDLEWARES
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//connecting database
connectDB();

//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})