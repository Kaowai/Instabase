import React from 'react'
import styles from './AccountStory.module.css'
import { useLocation, useNavigate } from 'react-router-dom'

interface InfoStory {
  isSeen: boolean
  nameAccount: string
  avatar?: string
}

const AccountStory = ({ isSeen, nameAccount, avatar }: InfoStory): React.JSX.Element => {
  const navigate = useNavigate()
  const location = useLocation()
  const handleNavigate = () => {
    navigate(`/stories/${nameAccount}`, {
      state: { from: location.pathname }
    })
  }
  return (
    <div className={styles.container} onClick={handleNavigate}>
      <div className={`${styles.avatar_wrapper} ${isSeen ? styles.seen_story : styles.not_seen_story}`}>
        <div className={styles.wrapper}>
          <img className={styles.imageUser} src={avatar} alt='' />
        </div>
      </div>
      <span>{nameAccount}</span>
    </div>
  )
}

export default AccountStory
