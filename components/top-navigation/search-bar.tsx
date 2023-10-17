import type { NextPage } from 'next'
import SearchIconContentContainer from './search-icon-content-container'

const SearchBar: NextPage = () => {
  return (
    <div className='rounded-mini bg-black-2 h-14 flex flex-col items-start justify-start py-4 px-3.5 box-border flex-1'>
      <SearchIconContentContainer />
    </div>
  )
}

export default SearchBar
