import React from 'react';

/**
 * A progress bar component for displaying allocation.
 * @param {object} props
 * @param {number} props.value - The percentage value for the bar (0-100).
 */
const AllocationBar = ({ value }) => {
  const percentage = Math.max(0, Math.min(100, value)); // Ensure value is between 0 and 100

  return (
    <div className="flex items-center gap-2 w-28"> {/* Fixed width for consistent bar size */}
      <div className="w-full h-4 bg-white border border-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-lighter transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AllocationBar;
