import express from "express";
import  {Signup,SignIn,UpdateUserProfile,AuthenticatedUser} from "../Controlers/userControler.js";
import {ProtectRoutes} from "../middlewares/auth.js";



const userRouter = express.Router();
userRouter.post("/signup",Signup);
userRouter.post("/login",SignIn);
userRouter.put("/update/:id",ProtectRoutes,UpdateUserProfile);
userRouter.get("/check",ProtectRoutes,AuthenticatedUser);

export default userRouter;