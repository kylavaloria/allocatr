import React from 'react';

const Input = ({ label, type = 'text', defaultValue = '', value, onChange, required, name, step, min, max }) => {
  const isDate = type === 'date';
  const inputId = name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-gray-300 text-body-md font-light font-sans">
        {label} {required && <span className="text-red-500">*</span>} {/* Still show asterisk for required */}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={isDate && !value ? 'text' : type}
          value={value}
          onChange={onChange}
          defaultValue={!value ? defaultValue : undefined}
          placeholder={label}
          required={required}
          step={step}
          min={min}
          max={max}
          onFocus={isDate ? (e) => (e.target.type = 'date') : undefined}
          onBlur={isDate ? (e) => { if (!e.target.value) { e.target.type = 'text'; } } : undefined}
          // Removed: invalid:border-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500
          className={`border border-gray-200 rounded-xl px-4 py-3 text-gray-300 text-body-md font-light font-sans
                      focus:outline-none focus:border-primary-dark focus:ring-2 focus:ring-primary-lighter transition-all duration-200
                      w-full
                      placeholder-gray-300/70
                      disabled:opacity-50
                      ${isDate ? 'pr-10' : ''}`}
        />
        {isDate && (
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
