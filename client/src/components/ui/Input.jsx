import React from 'react';

const Input = ({ label, type = 'text', defaultValue = '' }) => {
  const isDate = type === 'date';

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-300 text-body-md font-light font-sans">
        {label}
      </label>
      <div className="relative">
        <input
          type="text" // Start as text to show placeholder
          defaultValue={defaultValue}
          placeholder={label}
          // Change type to 'date' on focus
          onFocus={isDate ? (e) => (e.target.type = 'date') : null}
          // Change back to 'text' if empty on blur
          onBlur={isDate ? (e) => { if (!e.target.value) { e.target.type = 'text'; } } : null}
          className={`border border-gray-200 rounded-xl px-4 py-3 text-gray-300 text-body-md font-light font-sans
                     focus:outline-none focus:border-primary-dark focus:ring-2 focus:ring-primary-lighter transition-all duration-200
                     w-full
                     ${isDate ? 'pr-10' : ''}`} // Add padding for the icon
        />
        {/* Conditionally render calendar icon */}
        {isDate && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-300" // Color from your theme
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
