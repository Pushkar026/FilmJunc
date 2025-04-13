const express = require("express")
const router = express.Router()
const User=require("../UserSchema")

//route for new user registeration
router.post("/",(async (req,res)=>{
    const {Username,Email,Password}=req.body

    if (!Username || Username.trim() === '') {
        return res.status(400).send({ message: 'Username is required' });
      }


    try{
        
        

        //check for same email
        const Emailexists = await User.findOne({Email});
        if (Emailexists){
            res.status(400).json({message:"Email already exists"})
        }

       
        //new user creation
        const NewUser = new User({
            Username,
            Email,
            Password

        })

        //save to mongodb
        await NewUser.save()

        //success message
        res.status(201).json({message:"New user created succesfully"})

        
    }catch(error){
        console.error("Signup error:", error);
        res.status(500).json({ message: 'Something is wrong', error: error.message });
    }
    

}))

module.exports=router

