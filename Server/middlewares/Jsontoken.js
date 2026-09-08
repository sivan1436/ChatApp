import jwt from "jsonwebtoken";

export function GenerateToken(id){
    const token =jwt.sign({id},process.env.JWT_SECRET)
    return token;
}