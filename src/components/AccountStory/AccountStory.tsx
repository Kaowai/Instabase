import React from 'react'
import styles from './AccountStory.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { StoryFeed } from '../../models/story.model'

interface InfoStory {
  isSeen: boolean
  story: StoryFeed
}

const AccountStory = ({ isSeen, story }: InfoStory): React.JSX.Element => {
  const navigate = useNavigate()
  const location = useLocation()
  const handleNavigate = () => {
    navigate(`/stories/${story?.userId}`, {
      state: { from: location.pathname, userId: story?.userId }
    })
  }
  return (
    <div className={styles.container} onClick={handleNavigate}>
      <div className={`${styles.avatar_wrapper} ${isSeen ? styles.seen_story : styles.not_seen_story}`}>
        <div className={styles.wrapper}>
          <img className={styles.imageUser} src={story?.avatar} alt='' />
        </div>
      </div>
      <span>{story?.name}</span>
    </div>
  )
}

export default AccountStory
