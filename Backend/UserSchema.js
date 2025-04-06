const mongoose = require("mongoose");

//database schema
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:[true,"Username is required"],
        trim:true,
        unique:true
        },
    
    email:{
        type:String,
        require:[true,"Email is required"],
        trim:true,
        unique:true,
        lowercase:true,


    },

    password:{
        type:String,
        require:[true,"Invalid Password"]
    }

},{timestamps:true})

//exporting schema
const User = mongoose.model("User",UserSchema)
module.exports= User;



