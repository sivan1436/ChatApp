import { useContext } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/Authcontext'

const Rightsidebar = ({isOpen, onClose}) => {
  const {selecteduser,messages} = useContext(ChatContext)
  const {onlineuser} = useContext(AuthContext)
  const msgMedia = messages.filter((message)=>message.image || message.video || message.audio)
  return selecteduser && (
    <div className={`details-surface ${isOpen ? 'fixed inset-0 z-30 block h-[100dvh] w-full shadow-2xl' : 'hidden lg:block'} text-white min-w-0 min-h-0 relative overflow-y-auto`}>
      <button type='button' onClick={onClose} aria-label='Close user details' className='absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-xl lg:hidden'>
        x
      </button>

   <div className='mx-auto flex min-h-full w-full max-w-3xl flex-col items-center gap-2 px-5 pb-10 pt-16 text-xs font-light sm:px-10'>
  <img src={selecteduser?.profilePic || assets.avatar_icon} 
  className='w-20 aspect-[1/1] rounded-full'/>
  <h1 className='px-5 text-lg sm:text-xl text-center break-words font-medium mx-auto flex items-center
  gap-2'>
  <p className={`w-2 h-2 rounded-full ${onlineuser.includes(selecteduser._id) ? 'bg-green-500' : 'bg-gray-500'}`}></p>{selecteduser.fullname}
  </h1>
  <p className='px-5 text-center break-words'> {selecteduser.Bio || 'No bio added'}

  </p>
     <hr className='border-[#ffffff50] my-5'/>
    <div className='w-full px-0 text-xs'>
     <p className='text-sm'>Media shared in this chat</p>
     <div className='mt-3 grid max-h-none grid-cols-2 gap-3 overflow-y-visible opacity-90 sm:grid-cols-3'>
      {msgMedia.map((message,index)=>{
        const url = message.image || message.video || message.audio
        return (
        <div key={index}
        onClick={()=>window.open(url, '_blank', 'noopener,noreferrer')}
        className='cursor-pointer rounded overflow-hidden'>
          {message.audio ? (
            <audio src={url} controls className='w-full' />
          ) : message.video ? (
            <video src={url} controls className='aspect-square h-auto w-full rounded-md object-cover' />
          ) : (
            <img src={url} alt='Shared media' className='aspect-square h-auto w-full rounded-md object-cover'/>
          )}

        </div>
        )
      })}
      {!msgMedia.length && <p className='col-span-2 text-gray-400'>No media shared yet</p>}
      </div>

     </div>
  </div>
    </div>
  ) 
    
  
}

export default Rightsidebar;
