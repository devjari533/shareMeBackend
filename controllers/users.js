import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signup = async (req,res) =>{
    const {firstName,lastName,email,password,confirmPassword} = req.body
    try {
        const existingUser = await User.find({email})

        if(existingUser.length!==0) return res.send("User alreay exist")

        const hashedPassword = await bcrypt.hash(password,12)
        const newuser = await User.create({email,password:hashedPassword,name:`${firstName} ${lastName}`})
        const token = jwt.sign({email:newuser.email,id:newuser._id},'test',{expiresIn:'1h'})
        res.status(200).json({user:newuser,token})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong"})
    }
}

export const signin = async (req,res) =>{
    const{email,password}=req.body
    try {
    
        const existingUser = await User.findOne({email})
        if(!existingUser) return res.send("User doesn't exist")
        
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
        if(isPasswordCorrect==false) return res.send("Invalid Credentials")

        const token = jwt.sign({email:existingUser.email,id:existingUser._id,},'test',{expiresIn:'1h'})
        res.status(200).json({user:existingUser,token})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong"})
    }
}