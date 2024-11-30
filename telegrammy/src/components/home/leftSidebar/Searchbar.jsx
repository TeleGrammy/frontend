import { FaSearch } from 'react-icons/fa';

function SearchBar({ setSearchValue, searchValue }) {
  return (
    <div
      className="ml-3 flex h-12 w-full items-center rounded-full bg-bg-secondary px-3 py-2 text-text-primary"
      data-test-id="search-bar-container"
    >
      <FaSearch
        className="mr-2 text-text-primary opacity-70"
        data-test-id="search-icon"
      />
      <input
        type="text"
        className="flex-grow bg-transparent focus:border-none focus:outline-none"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        data-test-id="search-input"
      />
    </div>
  );
}

export default SearchBar;
