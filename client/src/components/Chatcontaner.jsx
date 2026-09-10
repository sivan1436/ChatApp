import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/Authcontext'
import toast from 'react-hot-toast'

const Chatcontaner = ({onDetailsClick}) => {
    const scrollEnd = useRef()
    const {messages,selecteduser,setSelecteduser,sendMessage,getMessages}=useContext(ChatContext)
    const {authUser,onlineuser}=useContext(AuthContext)
    const [input,setInput] =useState("")
    const [selectedMedia,setSelectedMedia] = useState(null)
    const [isRecording,setIsRecording] = useState(false)
    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
    // handle sending a message
  async function handleSendMessage(e){
   e.preventDefault()
   const text = input.trim()
   if(!text && !selectedMedia) return null;
   const messageData = text ? {text} : {}
   if(selectedMedia) messageData[selectedMedia.field] = selectedMedia.data
   if(await sendMessage(messageData)) {
     setInput("")
     setSelectedMedia(null)
   }
    }
    async function handleSendImage(e) {
      const file=e.target.files[0];
      if(!file || (!file.type.startsWith("image/") && !file.type.startsWith("video/"))){
        toast.error("slect an image or a video");
        return;
      }
      const reader = new FileReader();
      reader.onload = ()=>{
        setSelectedMedia({
          data: reader.result,
          field: file.type.startsWith("image/") ? "image" : "video",
          isVideo: file.type.startsWith("video/")
        })
      }
      reader.onerror = ()=>{
        toast.error("Unable to read the selected file");
      }
      reader.readAsDataURL(file)
      e.currentTarget.value = ""
      
    }
    async function handleVoiceMessage(){
      if(isRecording){
        mediaRecorderRef.current?.stop()
        return
      }
      if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){
        toast.error('Voice messages are not supported in this browser')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({audio:true})
        const recorder = new MediaRecorder(stream)
        audioChunksRef.current = []
        recorder.ondataavailable = (event)=>{
          if(event.data.size > 0) audioChunksRef.current.push(event.data)
        }
        recorder.onstop = ()=>{
          const audioBlob = new Blob(audioChunksRef.current, {type: recorder.mimeType || 'audio/webm'})
          const reader = new FileReader()
          reader.onload = ()=>{
            setSelectedMedia({
              data: reader.result,
              field: 'audio',
              isAudio: true
            })
          }
          reader.readAsDataURL(audioBlob)
          stream.getTracks().forEach((track)=>track.stop())
          setIsRecording(false)
          mediaRecorderRef.current = null
        }
        recorder.start()
        mediaRecorderRef.current = recorder
        setIsRecording(true)
      } catch (error) {
        toast.error(error.name === 'NotAllowedError' ? 'Microphone permission is required' : 'Unable to access microphone')
      }
    }
    useEffect(()=>{
      if(selecteduser){
        getMessages(selecteduser._id)
      }
    },[getMessages, selecteduser])
    useEffect(()=>{
      if (scrollEnd.current && messages ){
        scrollEnd.current?.scrollIntoView({behavior : "smooth"})
      }
    },[messages])
    
     
  return selecteduser ? (
    <div className='chat-surface h-full min-h-0 min-w-0 overflow-hidden relative backdrop-blur-lg'>
      {/* heasder */}
      <div className='flex items-center gap-3 py-3 mx-4
       border-b border-stone-500'>
        <button type='button' onClick={onDetailsClick} aria-label='Open user details' className='shrink-0 lg:pointer-events-none'>
          <img src={selecteduser.profilePic || assets.avatar_icon}
          className='w-8 rounded-full' />
        </button>
         <p className='flex-1 min-w-0 truncate text-base sm:text-lg text-white flex items-center gap-2'>
           {selecteduser.fullname}
          <span className={`h-2 w-2 shrink-0 rounded-full ${onlineuser.includes(selecteduser._id) ? 'bg-green-500' : 'bg-gray-500'}`}></span>
        </p>
        <img onClick={()=>{setSelecteduser(null)}} src={assets.arrow_icon}
        className='lg:hidden max-w-7' />
        <img src={assets.help_icon} className='max-lg:hidden max-w-5' />

      </div>
      {/* chat area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-auto p-3
      pb-6'>
        {messages.map((msg,index)=>(

          <div key={index}
          className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {msg.image ? (<img src={msg.image} alt='Sent image'
            className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>)
            : msg.video ? (<video src={msg.video} controls className='max-w-[230px] rounded-lg mb-8' />)
            : msg.audio ? (<audio src={msg.audio} controls className='max-w-[230px] mb-8' />)
            : (
              <p className={`message-bubble p-2 max-w-[200px] md:text-sm font-light
              rounded-lg mb-8 break-all text-white${msg.senderId===authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {msg.text}
              </p>
            )}
            <div className='text-center text-xs'>
              <img src={ msg.senderId === authUser._id ?  authUser?.profilePic || assets.avatar_icon : selecteduser?.profilePic||assets.avatar_icon} alt=''
              className='w-7 rounded-full'/>
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>

            </div>
          </div>
        ))}
        <div ref={scrollEnd}>

        </div>
      </div>
     {/* bottom area */}
     <div className='absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-2 sm:p-3'>
      {selectedMedia && (
        <div className='preview-surface relative self-start max-w-full rounded-lg border p-2'>
          {selectedMedia.isAudio ? (
            <audio src={selectedMedia.data} controls className='max-w-[min(18rem,70vw)]' />
          ) : selectedMedia.isVideo ? (
            <video src={selectedMedia.data} controls className='h-24 max-w-[min(18rem,70vw)] rounded object-contain' />
          ) : (
            <img src={selectedMedia.data} alt='Selected preview' className='h-24 max-w-[min(18rem,70vw)] rounded object-contain' />
          )}
          <button
            type='button'
            onClick={()=>setSelectedMedia(null)}
            aria-label='Remove selected media'
            className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-lg leading-none text-white ring-1 ring-gray-500'
          >
            x
          </button>
        </div>
      )}
      <div className='flex w-full items-center gap-2'>
      <div className='composer-surface flex-1 flex items-center px-3
      rounded-full min-w-0'>
        <input onChange={(e)=>{setInput(e.target.value)}}
        value={input} 
        onKeyDown={(e)=>{e.key==="Enter"?handleSendMessage(e) : null}}
        type='text'
        className='flex-1 min-w-0 text-sm p-3 border-none rounded-lg outline-none 
        text-white placeholder-gray-400'
        placeholder='send a message' />
        <input onChange={handleSendImage}
        type='file' id='media' accept='image/*,video/*' hidden />
        <label htmlFor='media'>
          <img src ={assets.gallery_icon} alt ="" 
          className="w-5 mr-2 cursor-pointer"/>
        </label>
      </div>
      <img onClick={handleSendMessage}
      src={assets.send_button} alt='' className='w-7 cursor-pointer' />
      <button type='button' onClick={handleVoiceMessage} aria-label={isRecording ? 'Stop recording' : 'Record voice message'} aria-pressed={isRecording} title={isRecording ? 'Stop recording' : 'Record voice message'} className={`record-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isRecording ? 'recording-button' : ''}`}>
        {isRecording ? <span className='h-3 w-3 rounded-sm bg-white' /> : <img src={assets.mic_icon} alt='' className='h-5 w-5' />}
      </button>
     </div>
    </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500
    bg-white/10 max-lg:hidden' >
      <img src={assets.logo_icon} alt='ChatNext'
      className='brand-logo max-w-16' />
      <p className='text-lg font-medium text-white'>Connect with your netwwork</p>
    </div>
  )
}

export default Chatcontaner;
