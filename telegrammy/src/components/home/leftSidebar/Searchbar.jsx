

import { FaSearch } from 'react-icons/fa';


function SearchBar() {
    return (
       <div className="flex items-center bg-bg-secondary h-12 text-text-primary px-3 py-2 ml-3 rounded-full w-full">
            <FaSearch className="text-text-primary mr-2 opacity-70" />
            <input
                type="text"
                className="bg-transparent flex-grow focus:outline-none focus:border-none"
                placeholder="Search..."
            />
        </div>
    )
}

export default SearchBar
