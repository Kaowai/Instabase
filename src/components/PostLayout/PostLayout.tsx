import React from 'react'
import styles from './PostLayout.module.css'
import Header from './Header/Header'
import Post from '../../assets/post.jpg'
import { FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa'
import { TbSend } from 'react-icons/tb'

const PostLayout = (): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header isSeen={true} />
      </div>
      <div className={styles.containerPost}>
        <img src={Post} alt='hehe' />
      </div>
      <div className={styles.action}>
        <div className={styles.icon}>
          <FaRegHeart size={24} />
          <FaRegComment size={24} />
          <TbSend size={24} />
        </div>
        <div className={styles.save}>
          <FaRegBookmark size={24} />
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.likeamount}>
          <span>{'1,675'} likes</span>
        </div>
        <div className={styles.caption}>
          <p>
            <span className={styles.nameAccount}>{'vtv24news'} </span>
            Hàn Quốc và Triều Tiên liên tục có những động thái cứng rắn chưa từng thấy trong nhiều năm trở lại đây,
            khiến tình hình
          </p>
        </div>
        <div className={styles.commentAmount}>
          <span>View {'1'} comments</span>
        </div>
        <div className={styles.comment}>
          <input placeholder='Add a comment' />
        </div>
        <div className={styles.divideVertical}></div>
      </div>
    </div>
  )
}

export default PostLayout
