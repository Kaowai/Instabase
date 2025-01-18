import { useEffect, useState } from 'react'
import defaultImage from '../assets/default-avatar.jpg' // Import a default image
import React from 'react'
import { randomImage } from './sharedFunctions'

interface RenderMediaProps {
  mediaUrl: string
  cssOverride?: string
}

export const RenderMedia: React.FC<RenderMediaProps> = ({
  mediaUrl,
  cssOverride = 'w-full h-full z-0 object-cover relative'
}) => {
  const isVideo =
    typeof mediaUrl === 'string' &&
    (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') || mediaUrl.endsWith('.ogg'))

  const [isImageError, setIsImageError] = useState(false)

  const handleImageError = () => {
    console.log(`Image failed to load: ${mediaUrl}`)
    setIsImageError(true)
  }

  return (
    <>
      {isImageError ? (
        <div className={`${cssOverride} bg-grey-color3 flex justify-center items-center`}> Loading media fail</div>
      ) : isVideo ? (
        <video className={cssOverride} onError={() => console.log('Video load error')}>
          <source src={mediaUrl} type='video/mp4' />
          <source src={mediaUrl} type='video/webm' />
          <source src={mediaUrl} type='video/ogg' />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={isImageError ? randomImage() : mediaUrl}
          alt='Media'
          loading='lazy'
          className={cssOverride}
          onError={handleImageError}
        />
      )}
    </>
  )
}
