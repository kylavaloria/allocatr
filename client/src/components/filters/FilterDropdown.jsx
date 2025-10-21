import React from 'react';

/**
 * A dropdown menu for filtering items.
 * @param {object} props
 * @param {string[]} props.options - An array of strings for the filter options.
 * @param {string[]} props.selectedOptions - An array of the currently selected options.
 * @param {(option: string) => void} props.onToggle - Function to call when an option is clicked.
 */
const FilterDropdown = ({ options, selectedOptions, onToggle }) => {
  return (
    // --- CHANGED: w-56 to w-48 ---
    <div className="absolute right-0 py-1.5 mt-0.5 w-48 bg-white border border-gray-200 rounded-lg font-sans z-10">
      <ul className="text-gray-300 text-body-xs font-normal">
        {options.map((option) => {
          const isChecked = selectedOptions.includes(option);

          return (
            <li key={option}>
              {/* --- CHANGED: py-2.5 to py-1.5, added hover:text-primary-dark --- */}
              <label className="flex items-center gap-2 w-full px-4 py-1.5">

                {/* Hidden actual checkbox */}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(option)}
                  className="sr-only peer"
                />

                {/* --- CHANGED: Added hover classes --- */}
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all cursor-pointer
                              ${isChecked
                                ? 'bg-gray-300 border-gray-300 hover:bg-primary-dark hover:border-primary-dark'
                                : 'bg-white border-gray-300 hover:border-primary-dark'
                              }`}
                >
                  {/* Checkmark Icon (only visible when checked) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-white ${isChecked ? 'block' : 'hidden'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Label Text */}
                <span>{option}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterDropdown;
