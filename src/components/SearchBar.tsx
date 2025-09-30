
import React from 'react';
import { SearchIcon, LoadingIcon } from './Icons';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading, disabled }) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading && !disabled) {
      onSearch();
    }
  };

  const isDisabled = isLoading || disabled;

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="مثال: Dacia Duster 2021"
        disabled={isDisabled}
        className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={onSearch}
        disabled={isDisabled}
        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:bg-blue-400 disabled:cursor-not-allowed transform transition-transform duration-300 active:scale-95"
        aria-label="Search"
      >
        {isLoading ? <LoadingIcon className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default SearchBar;
