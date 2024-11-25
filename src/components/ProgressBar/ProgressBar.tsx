import React, { useEffect, useState, useRef } from 'react'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  duration: number // Thời gian chạy (ms)
  onComplete?: () => void // Callback khi hoàn thành
  isPaused?: boolean // Trạng thái tạm dừng
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration, onComplete, isPaused = false }) => {
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number | null>(null) // Lưu thời điểm bắt đầu
  const elapsedTimeRef = useRef<number>(0) // Lưu thời gian đã trôi qua
  const animationFrameRef = useRef<number | null>(null)

  const updateProgress = (currentTime: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = currentTime
    }

    // Thời gian thực tế đã trôi qua
    const elapsed = elapsedTimeRef.current + (currentTime - startTimeRef.current)
    const newProgress = Math.min((elapsed / duration) * 100, 100)

    setProgress(newProgress)

    if (newProgress < 100) {
      // Tiếp tục cập nhật
      animationFrameRef.current = requestAnimationFrame(updateProgress)
    } else {
      // Hoàn thành
      onComplete?.()
    }
  }

  useEffect(() => {
    if (!isPaused) {
      startTimeRef.current = null
      animationFrameRef.current = requestAnimationFrame(updateProgress)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPaused])

  useEffect(() => {
    // Khi tạm dừng, lưu thời gian đã trôi qua
    if (isPaused && startTimeRef.current) {
      elapsedTimeRef.current += performance.now() - startTimeRef.current
    }
  }, [isPaused])

  return (
    <div className={styles.progressContainer}>
      <div
        className={styles.progressBar}
        style={{
          width: `${progress}%`,
          transition: isPaused ? 'none' : 'width 0.1s linear'
        }}
      />
    </div>
  )
}

export default ProgressBar
