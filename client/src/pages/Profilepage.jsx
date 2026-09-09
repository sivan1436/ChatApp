import React, { useContext, useState } from 'react'
import {useNavigate} from "react-router-dom"
import assets from '../assets/assets';
import { AuthContext } from '../../context/Authcontext';

const Profilepage = () => {
  const {authUser,updateProfile} = useContext(AuthContext)
  const [selectedImg,setSelectedImg] = useState(null);
  const navigate = useNavigate()
  const [name,setName] = useState(authUser.fullname)
  const [bio,setBio] = useState(authUser.Bio)
  async function HandileSubmit(e) {
    e.preventDefault();
    if(!selectedImg){
      const updated = await updateProfile({fullname:name,Bio:bio});
      if(updated) navigate('/')
      return;
    }
   const reader = new FileReader()
   reader.readAsDataURL(selectedImg)
   reader.onload= async ()=>{
    const base64Image = reader.result;
    const updated = await updateProfile({profilePicture:base64Image,fullname:name,Bio:bio})
    if(updated) navigate("/");
    return;
   }
    
  }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center
    justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2
      border-gray-600 flex-items-center justify-between max-sm:flex-col-reverse
      rounded-lg'>
        <form onSubmit={HandileSubmit}
        className='flex flex-col gap-5 p-10 flex-1'>
         <h3 className='text-lg'>User details</h3>
         <label htmlFor='avatar' className='flex items-center gap-3'>
          <input onChange={(e)=>{setSelectedImg(e.target.files[0])

          }}
          type='file' accept='.png ,.jpg,.jpeg' id="avatar" hidden/>
          <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
          className={`w-12 h-12 ${selectedImg && 'rounded'}`} alt=''/>
          upload profile image...
         </label>
         <input onChange={(e)=>setName(e.target.value)} 
         value={name}
         type='text' required placeholder='your name'
         className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
         focus:ring-violet-500' />
         <textarea
         value={bio} onChange={(e)=>setBio(e.target.value)}
         rows={3} type='text' required placeholder='Bio...'
         className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
         focus:ring-violet-500' />  
         <button type='submit'
         className='bg-gradient-to-r from-purple-400 
         to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>       
        </form>
        <img src={authUser?.profilePic || assets.logo_icon}
        className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10${selectedImg && 'rounded-full'}`} />
      </div>
   
    </div>
  )
}

export default Profilepage;
