/* eslint-disable prettier/prettier */
import React from 'react'
import SearchBar from '../SearchBar/SearchBar'
import styles from './SearchLayout.module.css'
import AccountSearch from '../AccountSearch/AccountSearch'

interface InfoSearch {
  nameAccount?: string
  name?: string
  isFollow?: boolean
  isHaveStory?: boolean,
  imageAccount?: string
}

const Example: Array<InfoSearch> = [
    {
        nameAccount: 'hoaiisreal',
        name: 'Nguyễn Cao Hoài',
        isFollow: true,
        isHaveStory: false
    },
    {
        nameAccount: 'nmin',
        name: 'Nguyễn Nhật Minh',
        isFollow: false,
        isHaveStory: true
    },
    {
        nameAccount: 'vietcetera',
        name: 'Vietcetera',
        isFollow: true,
        isHaveStory: true
    },
    {
        name: 'Bánh khọt Vũng Tàu',
    }
]
const SearchLayout = (): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <section>
        <h3>Search</h3>
      </section>
      <section className={styles.searchBar}>
        <SearchBar />
      </section>
      <span className={styles.divideVertical}></span>
      <section className={styles.historySearch}>
        <div>
            <span>Recent</span>
            <span>Clear all</span>
        </div>
        <div className={styles.listHistory}>
          {
            Example.map((search) => {
                return (
                    <AccountSearch key={search.name} name={search.name} nameAccount={search.nameAccount} isFollow={search.isFollow} isHaveStory={search.isHaveStory} imageAccount={search.imageAccount}/>
                )
            })
          }
        </div>
      </section>
    </div>
  )
}

export default SearchLayout
