import React, { useEffect, useState, useRef } from 'react'

interface Props {
  duration: number
  onComplete: () => void
  isPaused: boolean
  isActive: boolean
  isCompleted: boolean
}

const ProgressBar = React.memo(function ProgressBar({ duration, onComplete, isPaused, isActive, isCompleted }: Props) {
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isCompleted) {
      setProgress(100)
      return
    }

    if (!isActive) {
      setProgress(0)
      return
    }

    if (!isActive || isPaused) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      return
    }
    // Reset progress when becoming active
    if (isActive && progress === 0) {
      setProgress(0)
    }

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current)
          }
          if (isActive) onComplete() // Chỉ gọi `onComplete` khi `isActive`
          return 100
        }
        return prev + 100 / (duration / 100)
      })
    }, 100)

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPaused, isActive, isCompleted, duration, onComplete])

  useEffect(() => {
    if (isActive) {
      setProgress(0)
    }
  }, [isActive])

  return (
    <div className='h-[2px] bg-white/30 flex-1 rounded-full overflow-hidden'>
      <div
        className='h-full bg-white transition-all duration-100 ease-linear rounded-full'
        style={{ width: `${progress}%` }}
      />
    </div>
  )
})

export default ProgressBar
