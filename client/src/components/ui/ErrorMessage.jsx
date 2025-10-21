import React from 'react';

const ErrorMessage = ({ title = 'Error', message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-primary-lighter text-primary rounded-lg p-4 font-sans">
      <p className="font-medium text-body-xs">
        {title}
      </p>
      <p className="font-light text-body-xs">
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage;
