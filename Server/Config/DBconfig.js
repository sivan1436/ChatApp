import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
async function connectDB() {
    try{mongoose.connection.on('connected',()=>console.log("DB connected"))
        await mongoose.connect(`${process.env.MONGO_URI}/Chat-App`,)
    }
    catch(err){
        console.log(err)
    }
};

export default connectDB;