import express from "express";
import { GetUsers,GetMessages,MarkAsSeen,SendMessage } from "../Controlers/messageControler.js";
import { ProtectRoutes } from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.get("/users",ProtectRoutes,GetUsers);
messageRouter.get("/:id",ProtectRoutes,GetMessages);
messageRouter.get("mark/:id",ProtectRoutes,MarkAsSeen);
messageRouter.post("/send/:id",ProtectRoutes,SendMessage);

export default messageRouter;