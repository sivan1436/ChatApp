import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import Chatcontaner from '../components/Chatcontaner'
import Rightsidebar from '../components/Rightsidebar'

const HomePage = () => {
    const [selecteduser,setSelecteduser] = useState(false)
  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
       <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selecteduser ? 'md:grid-cols-[1fr_1.5_fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <SideBar selecteduser={selecteduser} setSelecteduser={setSelecteduser}/>
        <Chatcontaner selecteduser={selecteduser} setSelecteduser={setSelecteduser} />
        <Rightsidebar selecteduser={selecteduser} setSelecteduser={setSelecteduser} />
       </div>
      
    </div>
  )
}

export default HomePage
