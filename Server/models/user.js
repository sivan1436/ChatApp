import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : true
    },
    fullname:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    profilePic:{
        type : String,
        default : ""
    },
    Bio:{
        type : String,
        default : ""
    }
},{
    timestamps : true
});

const user =mongoose.model("user",userSchema);
export default user;