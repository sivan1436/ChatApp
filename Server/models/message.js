import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
   senderId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user",
    required : true
   }
},{
    timestamps : true
});

const user =mongoose.model("user",userSchema);
export default user;