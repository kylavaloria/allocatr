import React from 'react';

/**
 * Renders the "Actual vs Maximum Revenue" progress bar.
 * @param {object} props
 * @param {number} props.actual - The actual revenue value.
 * @param {number} props.max - The maximum revenue value.
 */
const RevenueBar = ({ actual, max }) => {
  const percentage = (actual / max) * 100;

  // Format numbers to currency
  const formatCurrency = (num) =>
    `$${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="w-full font-sans">
      {/* Progress Bar */}
      <div className="w-full h-4 bg-white border border-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-secondary-green" // Fill: #C4E78F
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1 text-gray-300 text-body-xs font-normal">
        {/* Note: 10px was requested, but 12px (text-body-xs) is the
          closest available size in your config.
        */}
        <span>{formatCurrency(actual)}</span>
        <span>{formatCode(max)}</span>
      </div>
    </div>
  );
};

export default RevenueBar;
