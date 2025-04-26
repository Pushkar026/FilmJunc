const mongoose = require("mongoose");

//database schema
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
        },
    
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        unique:true,
        lowercase:true,


    },

    password:{
        type:String,
        required:[true,"Invalid Password"]
    },
    
    profileImage:String,
    bannerImage: String,
    name:String,
    bio: String,
    location: String,
    role: String,
    socials: {
      instagram: String,
      website: String,
      // add more if needed
    },
    portfolio:
      {
        title: String,
        description: String,
        link: String,
      },

},{timestamps:true})

//exporting schema

module.exports= mongoose.model("User",UserSchema);



