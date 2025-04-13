const mongoose = require("mongoose");

//database schema
const UserSchema = new mongoose.Schema({
    Username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
        },
    
    Email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        unique:true,
        lowercase:true,


    },

    Password:{
        type:String,
        required:[true,"Invalid Password"]
    }

},{timestamps:true})

//exporting schema

module.exports= mongoose.model("User",UserSchema);



