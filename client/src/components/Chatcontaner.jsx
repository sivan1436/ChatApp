import React from 'react'
import assets from '../assets/assets'

const Chatcontaner = ({selecteduser,setSelecteduser}) => {
  return selecteduser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      <div className='flex items-center gap-3 py-3 mx-4
       border-b border-stone-500'>
        <img src={assets.profile_martin}
        className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>Martin Jahnson
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img onClick={()=>{setSelecteduser(null)}} src={assets.arrow_icon}
        className='md:hidden max-w-7' />
        <img src={assets.help_icon} className='max-md:hidden max-w-5' />

      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500
    bg-white/10 max-md:hidden' >
      <img src={assets.logo_icon}
      className='max-w-16' />
      <p className='text-lg font-medium text-white'>Connect with your netwwork</p>
    </div>
  )
}

export default Chatcontaner
