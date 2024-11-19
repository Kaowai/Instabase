import styles from './AccountSearch.module.css'
import avatar from './../../assets/avatar.png'

interface InfoSearch {
  nameAccount?: string
  name?: string
  isFollow?: boolean
  isHaveStory?: boolean
  imageAccount?: string
}

const AccountSearch = ({ nameAccount, name, isFollow, isHaveStory }: InfoSearch): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.containerImage}>
          <div className={`${isHaveStory && styles.avatar_wrapper}`}>
            <img className={styles.imageSearch} src={avatar} alt='' />
          </div>
        </div>
        <div className={styles.content}>
          <span className={styles.nameAccount}>{nameAccount}</span>
          <span className={styles.infoAccount}>{isFollow ? 'Following' : name}</span>
        </div>
      </div>
      <button>
        <span className='material-symbols-sharp md-24'>close</span>
      </button>
    </div>
  )
}

export default AccountSearch
