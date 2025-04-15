const express = require("express")
const router = express.Router()
const User=require("../Database/UserSchema")

//route for new user registeration
router.post("/",(async (req,res)=>{
    const {username,email,password}=req.body
    console.log('Request body:', req.body);

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required." });
      }


    try{
        
        

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
        console.error("Signup error:", error);
        res.status(500).json({ message: 'Something is wrong', error: error.message });
    }
    

}))

module.exports=router

