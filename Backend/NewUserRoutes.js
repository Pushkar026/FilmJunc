const express = require("express")
const router = express.Router()
const User=require("./UserSchema")

//route for new user registeration
router.post("/register",(async (req,res)=>{
    try{
        
        const {username,email,password}=req.body

        //check for same email
        const Emailexists = await User.findOne({email});
        if (Emailexists){
            res.status(400).json({message:"Email already exists"})
        }

       
        //new user creation
        const NewUser = new User({
            username,
            email,
            password

        })

        //save to mongodb
        await NewUser.save()

        //success message
        res.status(201).json({message:"New user created succesfully"})

        
    }catch(error){
        res.status(500).json({ message: 'Something went wrong', error });
    }
    

}))

module.exports=router

