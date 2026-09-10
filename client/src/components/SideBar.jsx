import { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/Authcontext'
import {ChatContext}   from "../../context/ChatContext"
const SideBar = () => {
  const {Getusers,users,selecteduser,setSelecteduser,unseenmessages,setUnseenmessages} = useContext(ChatContext)
    const navigate = useNavigate()
    const [input,setInput] = useState('')
    const {logout,onlineuser} = useContext(AuthContext)
    const FilteredUsers = input?users.filter((user)=>user.fullname.toLowerCase().includes(input.toLowerCase())):users
   useEffect(()=>{
    Getusers();
  },[Getusers, onlineuser])
  
    return (
    <div className={`sidebar-surface h-full min-h-0 min-w-0 p-4 sm:p-5 rounded-r-xl overflow-y-auto text-white
    ${selecteduser ?'max-lg:hidden' : '' }`}>  
     <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt='ChatNext' className='brand-logo max-w-40'/>
          <div className='relative py-2 group'>
           <img src={assets.menu_icon} alt='' className='max-h-5 cursor-pointer'/>       
           <div className='menu-surface absolute top-full right-0 z-20 w-32 p-5 rounded-md
           border text-gray-100 hidden
           group-hover:block'>
            <p onClick={()=>navigate('/profile')} 
            className='cursor-pointer text-sm'>Edit profile</p>
            <hr className='my-2 border-t border-gray-500'/>
            <p onClick={logout}
            className='cursor-pointer text-sm'>Logout</p>
            </div> 
          </div>
        </div>
        <div className='search-surface rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src={assets.search_icon} alt='search' className='w-3' />
            <input
              type='text'
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              className='bg-transparent border-none outline-none text-white text-xs placeholder-[#8c8c8] flex-1'
              placeholder='search user...'
            />
        </div>

     </div>
     <div className='flex flex-col'>
        {FilteredUsers.map((user,index)=>(
            <div key={index}
            onClick={()=>{setSelecteduser(user),setUnseenmessages((prev)=>(
              {...prev,[user._id]:0}
            ))}}
             className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
            ${selecteduser?._id === user._id && 'selected-user' }`}>
                <img src={user?.profilePic || assets.avatar_icon} alt=""
                className='w-9 h-9 shrink-0 rounded-full'/>
            <div className='flex flex-col leading-5'>
                <p>{user.fullname}</p>
                {onlineuser.includes(user._id) ? <span className='text-green-400 text-xs'>Online</span>
                :<span className='text-neutral-400 tex-xs'>Ofline</span>}
            </div>
            {unseenmessages[user._id] > 0&& <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center
             unread-badge'>{unseenmessages[user._id]}</p>}
            </div>
        ))}

     </div>
    </div>
  )
}

export default SideBar
