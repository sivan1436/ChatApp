import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./Config/DBconfig.js";
import dns from "dns";
import UserRouter from "./Routes/userRoutes.js";
import MessageRouter from "./Routes/messageRoutes.js";


dns.setServers(["8.8.8.8","8.8.4.4"]);

dotenv.config();
await connectDB();
const app = express();
const server = http.createServer(app);
// middleware
app.use(express.json({limit : "4mb"}));
app.use(cors());
app.use("/api/status", (req, res) => {
    res.status(200).json({message: "Server is running"});
});
app.use("/api/auth",UserRouter);
app.use("/api/messages",MessageRouter);
server.listen(process.env.PORT,()=>console.log("server is running on port:",process.env.PORT));
