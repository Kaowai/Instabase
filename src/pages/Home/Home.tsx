import React from 'react'
import AccountStory from '../../components/AccountStory/AccountStory'
import styles from './Home.module.css'
import PostLayout from '../../components/PostLayout/PostLayout'
import avatar1 from '../../assets/avatar1.webp'
import avatar2 from '../../assets/avatar2.webp'
import avatar3 from '../../assets/avatar3.jpg'
import avatar4 from '../../assets/avatar4.webp'
import avatar from '../../assets/avatar.png'
import AccountInfo from '../../components/AccountInfo/AccountInfo'
import vtv24 from '../../assets/vtv24.jpg'
interface InfoStory {
  isSeen: boolean
  nameAccount: string
  avatar: string
}

interface UserInfo {
  nameAccount: string
  nameUser: string
  isOwner: boolean
  isHaveStory: boolean
  avatar: string
}

const Example: Array<InfoStory> = [
  {
    isSeen: false,
    nameAccount: 'hoaiisreal',
    avatar: avatar1
  },
  {
    isSeen: false,
    nameAccount: 'nmin',
    avatar: avatar2
  },
  {
    isSeen: false,
    nameAccount: 'hoaiisreal',
    avatar: avatar3
  },
  {
    isSeen: false,
    nameAccount: 'hoaiisreal',
    avatar: avatar4
  },
  {
    isSeen: false,
    nameAccount: 'hoaiisreal',
    avatar: avatar1
  },
  {
    isSeen: false,
    nameAccount: 'hoaiisreal',
    avatar: avatar2
  },
  {
    isSeen: false,
    nameAccount: 'hoaiisreal',
    avatar: avatar3
  },
  {
    isSeen: false,
    nameAccount: 'hoaiisreal',
    avatar: avatar4
  }
]

const ListUser: Array<UserInfo> = [
  {
    nameAccount: 'dt.yennhi11',
    nameUser: 'Nguyễn Thị Yến Nhi',
    isOwner: false,
    isHaveStory: false,
    avatar: avatar1
  },
  {
    nameAccount: '_bcuonq_',
    nameUser: 'Bùi Cường',
    isOwner: false,
    isHaveStory: false,
    avatar: avatar2
  },
  {
    nameAccount: 'imtrucca',
    nameUser: 'Trúc Ca',
    isOwner: false,
    avatar: avatar3,
    isHaveStory: false
  },
  {
    nameAccount: 'vtv24',
    nameUser: 'VTV24 NEWS',
    isHaveStory: false,
    isOwner: false,
    avatar: vtv24
  }
]

const Home = (): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.grid_column1}>
        <div className={styles.story}>
          {Example.map((account) => {
            return (
              <AccountStory
                isSeen={account.isSeen}
                avatar={account.avatar}
                nameAccount={account.nameAccount}
                key={account.nameAccount}
              />
            )
          })}
        </div>
        <div className={styles.post}>
          <PostLayout />
          <PostLayout />
          <PostLayout />
          <PostLayout />
        </div>
      </div>
      <div className={styles.grid_column2}>
        <AccountInfo
          nameAccount='hoaiisreal'
          nameUser='Nguyễn Cao Hoài'
          isOwner={true}
          isHaveStory={false}
          avatar={avatar}
        />
        <div className={styles.divide}>
          <span>Suggested for you</span>
          <span>See All</span>
        </div>
        <div className={styles.recommendUser}>
          {ListUser.map((user) => {
            return (
              <AccountInfo
                isHaveStory={user.isHaveStory}
                key={user.nameAccount}
                nameAccount={user.nameAccount}
                nameUser={user.nameUser}
                isOwner={user.isOwner}
                avatar={user.avatar}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home
