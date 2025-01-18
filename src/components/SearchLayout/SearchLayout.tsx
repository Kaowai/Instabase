/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react'
import styles from './SearchLayout.module.css'
import AccountSearch from '../AccountSearch/AccountSearch'
import { searchGlobalUserService } from '../../apis/userService'
import { UserResponse } from '../../models/User/User.model'
import { Navigate, useNavigate } from 'react-router-dom'

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>
}
const SearchLayout = ({ setIsOpen, setActiveMenu }: Props): React.JSX.Element => {
  const [inputValue, setInputValue] = useState('') // Quản lý giá trị của input
  const [isFocused, setIsFocused] = useState(false)
  const [currentList, setCurrentList] = useState<UserResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  useEffect(() => {
    const historySearch = JSON.parse(localStorage.getItem('historySearch') || '[]')
    setCurrentList(historySearch)
  }, [])

  const debounceSearch = useCallback(
    debounce((value) => {
      setIsLoading(true) // Hiển thị loading
      searchGlobalUserService(value)
        .then((res) => {
          setCurrentList(res)
        })
        .catch((err) => {})
        .finally(() => setIsLoading(false))
    }, 500),
    []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value) // Cập nhật giá trị input khi người dùng nhập
    debounceSearch(value)
  }

  const handleClear = () => {
    setInputValue('') // Xóa nội dung input
  }

  const handleClickSearch = (nickName: string) => {
    navigate(`/${nickName}`)
    setActiveMenu('None')
    setIsOpen(true)
  }

  return (
    <div className={styles.container}>
      <section>
        <h3 className='text-2xl font-bold'>Search</h3>
      </section>
      <section className={styles.searchBar}>
        <div className={'flex items-center justify-center w-full gap-2 bg-hover-color h-[42px] p-3 rounded-lg'}>
          {!isFocused && inputValue === '' && <span className='material-symbols-sharp md-24'>search</span>}
          <input
            type='text'
            alt='Search'
            placeholder='Search'
            name='search-input'
            className='outline-none w-full flex-grow border-none text-black font-normal bg-hover-color'
            aria-label='Search input'
            value={inputValue} // Liên kết giá trị với state
            onChange={handleInputChange} // Cập nhật state khi người dùng nhập
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {inputValue !== '' && (
            <button
              type='button'
              className='outline-none border-none bg-transparent'
              aria-label='Clear search'
              onClick={handleClear} // Gọi hàm để xóa nội dung khi nhấn nút (onMouseDown để đảm bảo sự kiện thực thi trước onBlur)
            >
              <span className='material-symbols-sharp md-16'>cancel</span>
            </button>
          )}
        </div>
      </section>
      <span className={styles.divideVertical}></span>
      <section className={styles.historySearch}>
        <div>
          <span>Recent</span>
          <span>Clear all</span>
        </div>
        <div className={styles.listHistory}>
          {currentList.map((user) => {
            return <AccountSearch key={user?.userId} user={user} onClick={() => handleClickSearch(user.nickName)} />
          })}
        </div>
      </section>
    </div>
  )
}

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default SearchLayout
