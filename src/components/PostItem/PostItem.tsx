import React from 'react'
import styles from './PostItem.module.css'
import Post from '../../assets/post.jpg'

type Props = {
  onClick: () => void
}

const PostItem = ({ onClick }: Props): React.JSX.Element => {
  return (
    <>
      <div className={styles.containerItem} onClick={onClick}>
        <img src={Post} alt='' className={styles.imageItem} />
        <div className={styles.react}>
          <div className={styles.comment}>
            <span className='material-symbols-sharp filled md-24'>favorite</span>
            <span>76.7K</span>
          </div>
          <div className={styles.comment}>
            <span className='material-symbols-sharp filled md-24'>tooltip</span>
            <span>92</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostItem
