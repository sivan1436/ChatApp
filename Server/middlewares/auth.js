import jwt from "jsonwebtoken";
import user from "../models/user.js";

// middleware to verify the token
export async function ProtectRoutes(req,res,next){
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const authenticatedUser = await user.findById(decoded.id).select("-password")
        if(!authenticatedUser){
            return res.status(401).json({success : false,message : "User not found"});
        }
        req.user = authenticatedUser;
        next();

    }
  catch (error) {
    console.log(error);
    return res.status(401).json({success : false,message : "Not authorized"});
  } 
};
