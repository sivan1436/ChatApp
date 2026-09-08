import jwt from "jsonwebtoken";

// middleware to verify the token
export async function ProtectRoutes(req,res,next){
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await user.findbyId(decoded.UserId).select("-password")
        if(!user){
            return res.status(401).json({success : false,message : "User not found"});
        }
        req.user = user;
        next();

    }
  catch (error) {
    console.log(error);
    return res.status(401).json({success : false,message : "Not authorized"});
  } 
};
