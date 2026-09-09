import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./Authcontext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selecteduser, setSelecteduser] = useState([]);
    const [unseenmessages, setUnseenmessages] = useState({});
    const { socket, axios } = useContext(AuthContext);

    // function to get all user for side bar
    async function Getusers() {
        try {
            await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenmessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to get messages for selected users
    async function getMessages(userId) {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error);
        }
    }

    // function to send message to selected user
    async function sendMessage(messageData) {
        try {
            const { data } = await axios.post(
                `/api/messages/send${selecteduser._id}`,
                messageData
            );

            if (data.success) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    data.newMessage,
                ]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    }

    // function to subscribe to message for selected user
    function subscribeToMessages() {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selecteduser && newMessage.senderId === selecteduser._id) {
                newMessage.seen = true;
                setMessages((prevMessage) => [
                    ...prevMessage,
                    newMessage,
                ]);
                axios.put(`api/messages/mark${newMessage._id}`);
            } else {
                setUnseenmessages((prevUnseenMessage) => ({
                    ...prevUnseenMessage,
                    [newMessage.senderId]: prevUnseenMessage[
                        newMessage.senderId
                    ]
                        ? prevUnseenMessage[newMessage.senderId] + 1
                        : 1,
                }));
            }
        });
    }
    // function to unsubscribe from messages
    function unsubscribeFromMessages(){
        if(socket) socket.off("newMessage")
    }
useEffect(()=>{
    subscribeToMessages();
    return ()=>unsubscribeFromMessages();
},[socket,selecteduser])

    const value = {
        messages,
        users,
        selecteduser,
        Getusers,
        setMessages,
        sendMessage,
        setSelecteduser,
        unseenmessages,
        setUnseenmessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}
