import user from "../models/user.js";
import bcrypt from "bcryptjs";
import { GenerateToken } from "../middlewares/Jsontoken.js";
import cloudinary from "../lib/cloudinary.js";




export async function Signup(req,res) {
    try{
        const {
            fullname,
            email,
            password,
            Bio,
        }=req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({sucess : false,message : "Please fill all the fields"});
        }
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.status(400).json({sucess : false,message : "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await user.create({
            email,
            fullname,
            password : hasedPassword,
            Bio,
        }) 
        const  token = GenerateToken(newUser._id);
        return res.status(202).json({
            success :true,
            message : "User created successfully",
            newUser,
            token
        })
     } catch (error) {
        console.log(error);
        return res.status(500).json({sucess : false,message : "Internal Server Error"});

    }
};
// user login
 export async function SignIn(req,res){
    try{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({success : false,message : "Please fill all the fields"});  
    }
   const User = await user.findOne({email});
   if(!User){
    return res.status(400).json({
        success : false,
        message : "User not found"
    })
}
    const isPasswordMatch = await bcrypt.compare(password,User.password);
    if(!isPasswordMatch){
        return res.status(400).json({
            success : false,
            message : "Invalid password"
        })
    }  
    const token = GenerateToken(User._id);
    return res.status(200).json({
        success : true,
        message : "Login successful",
        user : User,
        token,
    })

}
catch (error) {
    console.log(error);
    return res.status(500).json({success : false,message : "Internal Server Error"});
}
};
// controler to check if user is authenticated
export function AuthenticatedUser(req,res){
        res.json({success : true,
            user : req.user
        })
        // controler to update user profile details
}
// controler to update user profile details
export async function UpdateUserProfile(req,res){
    try{
        const {
            profilePicture,
            fullname,
            Bio,
        } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if(!profilePicture){
            await user.findByIdAndUpdate(userId,{
                fullname,
                Bio,
            },{new : true});
            updatedUser = await user.findById(userId);
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePicture)
            updatedUser = await user.findByIdAndUpdate(userId,{
                profilePicture : upload.secure_url,
                fullname,
                Bio,},{new : true});
            }
        res.status(200).json({
            success:true,
            message : "user profile updated successfully",
            updatedUser
        })    
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success :false,message : "Internal Server Error"});
    }
};