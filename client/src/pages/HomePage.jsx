import { useContext, useState } from 'react'
import SideBar from '../components/SideBar'
import Chatcontaner from '../components/Chatcontaner'
import Rightsidebar from '../components/Rightsidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const { selecteduser } = useContext(ChatContext)
  const [showDetails, setShowDetails] = useState(false)
  return (
     <div className='w-full min-h-[100dvh] overflow-hidden px-0 py-0 sm:px-[4%] sm:py-[3%] lg:px-[10%] lg:py-[4%]'>
      <div className={`chat-frame backdrop-blur-xl border-0 sm:border-2 rounded-none sm:rounded-2xl overflow-hidden h-[100dvh] sm:h-[94dvh] grid grid-cols-1 relative min-w-0 ${selecteduser ? 'lg:grid-cols-[minmax(220px,1fr)_minmax(0,1.5fr)_minmax(220px,1fr)] xl:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)_minmax(240px,1fr)]' : 'lg:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)]'}`}>
        <SideBar />
        <Chatcontaner onDetailsClick={()=>setShowDetails(true)} />
        <Rightsidebar isOpen={showDetails} onClose={()=>setShowDetails(false)} />
       </div>
      
    </div>
  )
}

export default HomePage
