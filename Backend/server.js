require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//express application
const app = express();

//middleware
app.use(cors())
app.use(express.json())

//getting environment variables
const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

//connecting database
mongoose.connect(MONGO_URL)
.then(()=>console.log("mongodb database succesfully connected "))
.catch((error)=>console.log("error connecting database",error))

//signup route
const SignupRoute = require("./routes/signup")
app.use("/signup",SignupRoute)

//setting the route
app.get("/",(req,res)=>{
    res.send("FILMJUNC BACKEND IS RUNNING")
});

//listening to port
app.listen(PORT,()=>{
    console.log("Server is running succesfully")
});
