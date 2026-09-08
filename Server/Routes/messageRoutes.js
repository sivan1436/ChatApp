import express from "express";
import { GetUsers,GetMessages,MarkAsSeen } from "../Controlers/messageControler.js";
import { ProtectRoutes } from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.get("/users",ProtectRoutes,GetUsers);
messageRouter.get("/:id",ProtectRoutes,GetMessages);
messageRouter.get("mark/:id",ProtectRoutes,MarkAsSeen);


export default messageRouter;