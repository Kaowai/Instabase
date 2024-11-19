import { useState } from 'react'
import styles from './SearchBar.module.css'

const SearchBar = (): React.JSX.Element => {
  const [inputValue, setInputValue] = useState('') // Quản lý giá trị của input
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    setInputValue('') // Xóa nội dung input
  }

  return (
    <div className={styles.container}>
      {!isFocused && inputValue === '' && <span className='material-symbols-sharp md-24'>search</span>}
      <input
        type='text'
        alt='Search'
        placeholder='Search'
        name='search-input'
        aria-label='Search input'
        value={inputValue} // Liên kết giá trị với state
        onChange={(e) => setInputValue(e.target.value)} // Cập nhật state khi người dùng nhập
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {inputValue !== '' && (
        <button
          type='button'
          aria-label='Clear search'
          onClick={handleClear} // Gọi hàm để xóa nội dung khi nhấn nút (onMouseDown để đảm bảo sự kiện thực thi trước onBlur)
        >
          <span className='material-symbols-sharp md-16'>cancel</span>
        </button>
      )}
    </div>
  )
}

export default SearchBar
