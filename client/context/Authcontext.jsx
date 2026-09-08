import { Children } from "react";
import { createContext } from "react";
import axios from "axios"
import { useState } from "react";
import toast from "react-hot-toast"
import { useEffect } from "react";




const backendURL = import.meta.env.VITE_BACKENDURL
axios.defaults.baseURl = backendurl
export const AuthContext = createContext();

export function AuthProvider({Children}){
const [token,setToken] = useState(localStorage.getItem("token"))
const [authuser,setAuthuser] = useState(null)
const [onlineuser,setOnlineuser] = useState([]);
const [socket,setSocket] = useState(null)

// check if user is authenticated and if so set the user data and connect the socket
 async function checkAuth(){
    try{
      const {data} =  await axios.get("/api/auth/check");
      if(data.success){
        setAuthuser(data.user)
      }
    }
    catch(error){
        toast.error(error.message)

    }
 }
 useEffect(()=>{
    if(token){
        axios.defaults.headers.common["token"] = token
    }
    checkAuth
 })

    const value = {
        axios,
        authuser,
        onlineuser,
        socket

    }
    return (
        <AuthContext.Provider value={value}>
        {Children}
        </AuthContext.Provider>
        
    )
}