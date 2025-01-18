import React, { useState } from 'react'
import { BiSolidVideos, BiTransfer } from 'react-icons/bi'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Interactions from '../Interactions/Interactions'
import PhotoAndVideos from '../PhotosAndVideos/PhotoAndVideos'

const ActivityAccount = () => {
  const [activeTab, setActiveTab] = useState<'interactions' | 'photosAndVideos'>('interactions')
  const navigate = useNavigate()
  const handleActive = (activeTab: string) => {
    setActiveTab(activeTab)
    if (activeTab === 'interactions') {
      navigate('/your_account/activity/interactions')
    } else {
      navigate('/your_account/activity/photos_and_videos')
    }
  }
  return (
    <div className='ml-[17rem] border min-h-screen overflow-y-hidden box-border inset-0 flex items-center justify-center'>
      <div className={` border relative bg-white h-[600px] overflow-hidden grid grid-cols-[250px_650px]`}>
        <div className='border-r-[1px] relative'>
          {/* Header */}
          <div className=' absolute w-full h-16 top-0 border-b flex justify-start px-4 items-center font-semibold text-lg'>
            Your activity
          </div>
          <div
            onClick={() => handleActive('interactions')}
            className={`flex justify-start max-h-28 h-full cursor-pointer gap-5 mt-16 py-2 pl-2 hover:bg-grey-color4 transition-all duration-300 ${activeTab === 'interactions' && 'bg-grey-color4'}`}
          >
            <div className='w-12 h-12'>
              <BiTransfer size={32} />
            </div>
            <div className='flex justify-start items-start flex-col'>
              <span className={`${activeTab === 'interactions' && 'font-semibold'}`}>Interactions</span>
              <span className='text-sm text-grey-color2'>
                Review and delete likes, comments, and your other interactions.
              </span>
            </div>
          </div>
          <div
            onClick={() => handleActive('photosAndVideos')}
            className={`flex justify-start max-h-28 h-full gap-5 cursor-pointer py-2 pl-2 hover:bg-grey-color4 transition-all duration-300 ${activeTab === 'photosAndVideos' && 'bg-grey-color4'}`}
          >
            <div className='w-12 h-12'>
              <BiSolidVideos size={32} />
            </div>
            <div className='flex justify-start items-start flex-col'>
              <span className={`${activeTab === 'photosAndVideos' && 'font-semibold'}`}>Photos and Videos</span>
              <span className='text-sm text-grey-color2'>View, archive or delete photos and videos you've shared</span>
            </div>
          </div>
        </div>
        <div className={`overflow-y-hidden rounded-xl w-full relative`}>
          <Routes>
            <Route path='/interactions' element={<Interactions />} />
            <Route path='/photos_and_videos' element={<PhotoAndVideos />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default ActivityAccount
