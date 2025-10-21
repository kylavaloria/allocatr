import React from 'react';

const Button = ({ label, onClick, className = '' }) => { // Added className prop
  return (
    <button
      onClick={onClick}
      // Appended the className prop to the end
      className={`border border-gray-300 text-gray-300 text-body-md font-normal font-sans rounded-xl
                 px-8 py-3 bg-white text-center transition-all duration-200
                 hover:bg-gray-300 hover:text-gray-50
                 focus:outline-none focus:bg-gray-300 focus:text-gray-50
                 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
