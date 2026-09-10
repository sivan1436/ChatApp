
// get all users except the logged in user
import Message from "../models/message.js";
import user from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import {io,userSocketMap} from "../server.js";



export async function GetUsers(req,res){
    try{
        const userId = req.user._id;
        const filteredUsers = await user.find({_id :{ $ne : userId}}).select("-password");
        const unseenMessages = {}
        const promise = filteredUsers.map(
            async(user)=>{
                const messages = await Message.find(
                    {senderId : user._id,
                        receiverId : userId,
                        seen : false
                    })
                    if(messages.length >0){
                        unseenMessages[user._id] = messages.length
                    }
            })
            await Promise.all(promise)
            res.status(200).json({success : true, users : filteredUsers, unseenMessages})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status : false,
            message : "Internal server error"});
    }

};

// get all messages for selected user
export async function GetMessages(req,res){
    try{
        const {id :selectedUserId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find(
            {
                $or :[
                    {
                        senderId : myId,
                        receiverId : selectedUserId
                    },
                    {
                        senderId : selectedUserId,
                        receiverId : myId 
                    }  
                ]
            })
            await Message.updateMany({
                senderId : selectedUserId,
                receiverId : myId,
                seen : false
            },{
                seen : true
            })
    res.status(200).json({success : true, messages})
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status : false,
            message : "Internal server error"});
    };
};

// api to mark as seen using message id
export async function MarkAsSeen(req,res){
    try{
        const {id} = req.params;
        const message = await Message.findByIdAndUpdate(id, { seen: true });
        res.status(200).json({success :true});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status : false,
            message : "Internal server error"});
    }
}
// controler to send message
export async function SendMessage(req,res){
    try{
        const {text,image,video,audio} = req.body;
        const senderId = req.user._id;
        const {id :receiverId} = req.params;
        if(!text && !image && !video && !audio){
            return res.status(400).json({
                success : false,
                message : "Empty message cannot be sent"
            });
        }
            let imageUrl;
            let videoUrl;
            let audioUrl;
            if(image){
                const uploadedImage =  await cloudinary.uploader.upload(image, {resource_type : "image"});
                imageUrl = uploadedImage.secure_url;
                 }
                 if(video){
                    const uploadedVideo =  await cloudinary.uploader.upload(video, {resource_type : "video"});
                    videoUrl = uploadedVideo.secure_url;
                     }
                      if(audio){
                          const uploadedAudio = await cloudinary.uploader.upload(audio, {resource_type : "video"});
                          audioUrl = uploadedAudio.secure_url;
                            }
                     const newMessage = await Message.create(
                        {
                            senderId,
                            receiverId,
                            text,
                           image : imageUrl,
                           video : videoUrl,
                           audio : audioUrl
                        }
                     )
                     // emit the new message to the receiver
                     const receiverSocket = userSocketMap[receiverId];
                     if(receiverSocket){
                        io.to(receiverSocket).emit("newMessage",newMessage);
                     }
                 res.status(200).json({success : true,newMessage});
    
}   
    catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Internal server error"});
    }

}