import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./Config/DBconfig.js";
import dns from "dns";
import UserRouter from "./Routes/userRoutes.js";
import MessageRouter from "./Routes/messageRoutes.js";
import {Server} from "socket.io";


dns.setServers(["8.8.8.8","8.8.4.4"]);

dotenv.config();

const app = express();
const server = http.createServer(app);
// initializing socket.io server
export const io = new Server(server,{
    cors : {origin : "*"}
})
// store online users
export const userSocketMap = {};// userId : socketId
// socket.io connection handler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("user connected",userId);
    if(userId){
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    }

    // Remove only this connection, so a newer tab for the same user stays online.
    socket.on("disconnect",()=>{
        console.log("user disconnected",userId);
        if(userSocketMap[userId] === socket.id){
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
});
// middleware
app.use(express.json({limit : "4mb"}));
app.use(cors());
await connectDB();
app.use("/api/status", (req, res) => {
    res.status(200).json({message: "Server is running"});
});
app.use("/api/auth",UserRouter);
app.use("/api/messages",MessageRouter);
server.listen(process.env.PORT,()=>console.log("server is running on port:",process.env.PORT));

