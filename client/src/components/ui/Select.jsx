import React from 'react';

const Select = ({ label, options = [], defaultValue = '', value, onChange, required, name, id }) => {
  const selectId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className="text-gray-300 text-body-md font-light font-sans">
        {label} {required && <span className="text-red-500">*</span>} {/* Still show asterisk for required */}
      </label>
      <div className="relative">
        <select
          id={selectId}
          name={name || selectId}
          value={value}
          onChange={onChange}
          defaultValue={!value ? defaultValue : undefined}
          required={required}
          // Removed: invalid:border-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500
          className={`appearance-none border border-gray-200 rounded-xl px-4 py-3 text-gray-300 text-body-md font-light font-sans
                      focus:outline-none focus:border-primary-dark focus:ring-2 focus:ring-primary-lighter transition-all duration-200
                      w-full
                      pr-10 bg-white
                      disabled:opacity-50`}
        >
          <option value="" disabled={defaultValue !== ''}>
             Select {label}...
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Select;
