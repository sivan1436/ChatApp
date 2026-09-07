import React, { useState } from 'react'
import assets from '../assets/assets'

const Lofinpage = () => {
  const [currentstate,setCurrentstate] = useState("Sign up")
  const [fullname,setFullname] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [Bio,setBio] = useState("")
  const [isDataSubmited,setIsDataSubmited] = useState(false)
  async function onSubmitHandler(e) {
    e.preventDefault();
    if(currentstate ==="Sign up" && !isDataSubmited){
      setIsDataSubmited(true)
    }
    
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center
    justify-content gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
     {/* left */}
     <img src={assets.logo_big} alt='' className='w-[min(30vw,250px)]' />
        {/* Right side */}
       <form onSubmit={onSubmitHandler}
       className='border-2 bg-white/8 text-white border-gray-500 p-6 
       flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
        {currentstate}
          <img src={assets.arrow_icon} alt='' className='w-5 cursor-pointer' /></h2>
       { currentstate === "Sign up" && ! isDataSubmited && 
       <input type='text' className='p-2 border border-gray-500 rounded-md
       focus:outline-none' placeholder='Full name' 
       required 
       onChange={(e)=>{setFullname(e.target.value)}}/> 
       }
       {!isDataSubmited &&(
        <>
       <input type='email' className='p-2 border border-gray-500 rounded-md
       focus:outline-none' placeholder='email Dress' 
       required 
       onChange={(e)=>{setEmail(e.target.value)}}/>
      <input type='password' className='p-2 border border-gray-500 rounded-md
       focus:outline-none' placeholder='password' 
       required 
       onChange={(e)=>{setPassword(e.target.value)}}/>
        </>
       )}
       {
        currentstate === "Sign up" && isDataSubmited &&(
          <textarea 
          onChange={(e)=>{setBio(e.target.value)}}
          value={Bio}
          rows={4} 
          className='p-2 border border-gray-500 roumded-md
          focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='provide a short bio...' required></textarea>

        )
       }
       <button
       type='submit'
       className='py-3 bg-gradient-to-r from-purple-400 to-violet-600
       text-white rounded-md cursor-pointer'>{currentstate === "Sign up" ? 'Create Account' : "Login Now"}</button>
       <div className='flex items-center gap-2 text-sm text-gray-500'>
        <input type='checkbox' />
        <p>Agree to the terms of use & privacy policy</p>
       </div>
       <div className='flex flex-col gap-2'>
         {currentstate === "Sign up" ?(
          <p className='text-sm text-gray-600'>
            Already have an Account ? 
            <span onClick={()=>{setCurrentstate("Sign In");setIsDataSubmited(false)}}
              className='font-medium text-violet-500 cursor-pointer'>Login her</span></p>
         ):(
          <p
          className='text-sm text-gray-600'>
            Don't have an account ? <span onClick={()=>{setCurrentstate("Sign up");}}
            className='font-medium text-violet-500 cursor-pointer'>Sign up</span></p>
         )}
       </div>
       </form>
    </div>
  )
}

export default Lofinpage
