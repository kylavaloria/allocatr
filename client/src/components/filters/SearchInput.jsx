import React from 'react';

const SearchInput = ({ placeholder = 'Search' }) => {
  return (
    <div className="relative w-full font-sans">

      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg
          xmlns="http://www.w.w3.org/2000/svg"
          className="h-5 w-5 text-gray-300" // Icon color
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-full
                   py-2 pl-11 pr-4
                   text-gray-300 text-body-md font-normal
                   placeholder-gray-300
                   focus:outline-none focus:border-primary-dark focus:ring-2 focus:ring-primary-lighter transition-all duration-200"
      />
    </div>
  );
};

export default SearchInput;
