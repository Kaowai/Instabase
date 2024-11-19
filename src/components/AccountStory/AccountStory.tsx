import React from 'react'

interface InfoStory {
  isSeen: boolean
  nameAccount: string
  avatar?: string
}

import styles from './AccountStory.module.css'
const AccountStory = ({ isSeen, nameAccount, avatar }: InfoStory): React.JSX.Element => {
  return (
    <div className={styles.container}>
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
