import { FaSearch } from 'react-icons/fa';

function SearchBar() {
  return (
    <div className="ml-3 flex h-12 w-full items-center rounded-full bg-bg-secondary px-3 py-2 text-text-primary">
      <FaSearch className="mr-2 text-text-primary opacity-70" />
      <input
        type="text"
        className="flex-grow bg-transparent focus:border-none focus:outline-none"
        placeholder="Search..."
      />
    </div>
  );
}

export default SearchBar;
