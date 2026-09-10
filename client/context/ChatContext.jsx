import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./Authcontext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selecteduser, setSelecteduser] = useState(null);
    const [unseenmessages, setUnseenmessages] = useState({});
    const { socket, axios } = useContext(AuthContext);

    // function to get all user for side bar
    const Getusers = useCallback(async function Getusers() {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenmessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [axios]);

    // function to get messages for selected users
    const getMessages = useCallback(async function getMessages(userId) {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error);
        }
    }, [axios]);

    // function to send message to selected user
    async function sendMessage(messageData) {
        try {
            const { data } = await axios.post(
                `/api/messages/send/${selecteduser._id}`,
                messageData
            );

            if (data.success) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    data.newMessage,
                ]);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    }

    // function to subscribe to message for selected user
    const subscribeToMessages = useCallback(function subscribeToMessages() {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selecteduser && newMessage.senderId === selecteduser._id) {
                newMessage.seen = true;
                setMessages((prevMessage) => [
                    ...prevMessage,
                    newMessage,
                ]);
                axios.get(`/api/messages/mark/${newMessage._id}`);
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
    }, [axios, selecteduser, socket]);
    // function to unsubscribe from messages
    const unsubscribeFromMessages = useCallback(function unsubscribeFromMessages(){
        if(socket) socket.off("newMessage")
    }, [socket]);
useEffect(()=>{
    subscribeToMessages();
    return ()=>unsubscribeFromMessages();
},[subscribeToMessages, unsubscribeFromMessages])

    const value = {
        messages,
        users,
        selecteduser,
        Getusers,
        getMessages,
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
