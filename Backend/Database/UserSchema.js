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
    }

},{timestamps:true})

//exporting schema

module.exports= mongoose.model("User",UserSchema);



