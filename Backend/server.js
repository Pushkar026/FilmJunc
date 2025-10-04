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

//login route
const LoginRoute = require("./routes/login")
app.use("/login",LoginRoute)

//userprofile route
const UserprofileRoute = require("./routes/userprofile")
app.use("/",UserprofileRoute)

//editprofile route
const EditProfileRoutes = require("./routes/editprofile"); 
app.use('/', EditProfileRoutes);

//search route
const searchRoutes = require('./routes/search'); 
app.use("/api",searchRoutes);

//viewprofile route
const ViewProfileRoute = require("./routes/viewprofile");
app.use("/api",ViewProfileRoute);

//messages route
const MessageRoute = require("./routes/messages");
app.use("/api",MessageRoute)

//inbox route
const InboxRoute = require("./routes/inbox");
app.use("/api",InboxRoute)

// serve uploaded files
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const PostRoute = require("./routes/posts");
app.use("/posts", PostRoute);






//setting the route
app.get("/",(req,res)=>{
    res.send("FILMJUNC BACKEND IS RUNNING")
});

//listening to port
app.listen(PORT,()=>{
    console.log("Server is running succesfully")
});
