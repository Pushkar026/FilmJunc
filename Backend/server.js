require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

// socket handler
const setupSocket = require("./socket/socket");

// express application
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// environment variables
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// =====================
// DATABASE CONNECTION
// =====================

mongoose.connect(MONGO_URL)
.then(()=>console.log("MongoDB database successfully connected"))
.catch((error)=>console.log("Error connecting database",error));


// =====================
// ROUTES
// =====================

// signup route
const SignupRoute = require("./routes/signup");
app.use("/signup",SignupRoute);

// login route
const LoginRoute = require("./routes/login");
app.use("/login",LoginRoute);

// user profile route
const UserprofileRoute = require("./routes/userprofile");
app.use("/",UserprofileRoute);

// edit profile route
const EditProfileRoutes = require("./routes/editprofile"); 
app.use("/", EditProfileRoutes);

// search route
const searchRoutes = require("./routes/search"); 
app.use("/api",searchRoutes);

// view profile route
const ViewProfileRoute = require("./routes/viewprofile");
app.use("/api",ViewProfileRoute);

// messages route
const MessageRoute = require("./routes/messages");
app.use("/api",MessageRoute);

// inbox route
const InboxRoute = require("./routes/inbox");
app.use("/api",InboxRoute);

// collaboration route
const CollaborationRoute = require("./routes/collaboration");
app.use("/collaboration", CollaborationRoute);

// posts route
const PostRoute = require("./routes/posts");
app.use("/posts", PostRoute);


// =====================
// STATIC FILES
// =====================

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// =====================
// SOCKET.IO SETUP
// =====================

// create HTTP server
const server = http.createServer(app);

// create socket server
const io = new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"]
  }
});

// initialize socket logic
setupSocket(io);


// =====================
// TEST ROUTE
// =====================

app.get("/",(req,res)=>{
  res.send("FILMJUNC BACKEND IS RUNNING");
});


// =====================
// START SERVER
// =====================

server.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});