import React, { useEffect, useState } from 'react'
import styles from './ProgressBar.module.css'
interface ProgressBarProps {
  duration: number // Thời gian chạy (ms)
  onComplete?: () => void // Callback khi hoàn thành
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration, onComplete }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setTimeout(() => {
      setProgress(100) // Tăng width tới 100%
    }, 0)

    const timer = setTimeout(() => {
      onComplete?.() // Gọi callback khi hoàn thành
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(interval)
    }
  }, [duration, onComplete])

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar} style={{ width: `${progress}%`, transition: `width ${duration}ms linear` }} />
    </div>
  )
}

export default ProgressBar
