import { createContext } from "react";
import axios from "axios"
import { useCallback, useState } from "react";
import toast from "react-hot-toast"
import { useEffect } from "react";
import {io} from "socket.io-client"




const backendurl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendurl
export const AuthContext = createContext();

export function AuthProvider({ children }){
const [token,setToken] = useState(localStorage.getItem("token"))
const [authuser,setAuthuser] = useState(null)
const [onlineuser,setOnlineuser] = useState([]);
const [socket,setSocket] = useState(null)

// connect socket function to handle socket connection and online user updates
const connectSocket = useCallback(function connectSocket(userData){
    if(!userData || socket?.connected ) return;
    const newSocket = io(backendurl,{
        query :{
         userId : userData._id
        }
    })
    newSocket.connect()
   setSocket(newSocket)
   newSocket.on("getOnlineUsers",(userIds)=>{
    setOnlineuser(userIds);
   })
}, [socket])

// check if user is authenticated and if so set the user data and connect the socket
 const checkAuth = useCallback(async function checkAuth(){
    try{
      const {data} =  await axios.get("/api/auth/check");
      if(data.success){
        setAuthuser(data.user)
        connectSocket(data.user)
      }
    }
    catch(error){
        toast.error(error.message)

    }
 }, [connectSocket])
//  login function to handle user authentication and socket
async function Login(state,credentials){
    try{
            const { data } = await axios.post(`/api/auth${state}`,credentials);
        if(data.success){
    const userData = data.user || data.newUser
    setAuthuser(userData)
    connectSocket(userData)
      axios.defaults.headers.common['token'] = data.token
      setToken(data.token)
      localStorage.setItem("token",data.token)
      toast.success(data.message)
        }
        else{
           toast.error(data.message) 
        }
    }
    catch(error){
            toast.error(error.message)
    }
}
    // 
   async function logout(){
    localStorage.removeItem("token")
    setToken(null)
    setAuthuser(null)
    setOnlineuser([])
    axios.defaults.headers.common["token"] = null;
    toast.success("logout successfully")
    socket.disconnect()
   }
//    to update profile function
async function updateProfile(body) {
    try{
        const { data } = await axios.put(`/api/auth/update/${authuser._id}`,body)
        if(data.success){
            setAuthuser(data.updatedUser)
            toast.success(data.message)
            return true
        }
        toast.error(data.message)
        return false
    }
    catch(error){
        toast.error(error.message)
        return false
    }
    
}


 useEffect(()=>{
    if(token){
        axios.defaults.headers.common["token"] = token
        checkAuth()
    }
 },[token, checkAuth])

    const value = {
        axios,
        authUser: authuser,
        onlineuser,
        socket,
        Login,
        logout,
        updateProfile,

    }
    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
        
    )
}