import React from 'react';

/**
 * A simple "Yes" or "No" indicator.
 * @param {object} props
 * @param {boolean} props.isBillable - Determines if "Yes" or "No" is displayed.
 */
const BillableIndicator = ({ isBillable }) => {
  const text = isBillable ? 'Yes' : 'No';
  const bgColor = isBillable ? 'bg-status-done' : 'bg-status-paused';

  return (
    <div
      className={`inline-flex items-center justify-center px-4 py-1 rounded-lg
                  ${bgColor} text-gray-50 font-sans font-medium text-body-xs`}
    >
      {text}
    </div>
  );
};

export default BillableIndicator;
