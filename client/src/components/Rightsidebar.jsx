import React from 'react'
import assets, { imagesDummyData } from '../assets/assets'

const Rightsidebar = ({selecteduser}) => {
  return selecteduser && (
    <div className={`bg-[#8185B2]/10 text-white w-full realative overflow-y-scroll ${selecteduser? 'max-md:hidden' : ""}`}>


   <div className='pt-6 flex flex-col items-center gap-2 text-xs font-light
  mx-auto'>
  <img src={selecteduser?.profilePic || assets.avatar_icon} 
  className='w-20 aspect-[1/1] rounded-full'/>
  <h1 className='px-10 text-xl font-medium mx-auto flex items-center
  gap-2'>
    <p className='w-2 h-2 rounded-full bg-green-500'></p>{selecteduser.fullName}
  </h1>
  <p className='px-10 mx-aut0'> {selecteduser.bio}

  </p>
  </div>
     <hr className='border-[#ffffff50] my-5'/>
     <div className='px-5 text-xs'>
      <p>media</p>
      <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2
      gap-4 opacity-80'>
      {imagesDummyData.map((url,index)=>(
        <div key={index}
        onClick={()=>window.open(url)}
        className='cursor-pointer rounded'>
          <img src={url} alt="" className='h-full rounded-md'/>

        </div>
      ))}
      </div>

     </div>
    </div>
  ) 
    
  
}

export default Rightsidebar
