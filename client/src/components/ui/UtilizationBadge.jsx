import React from 'react';

// Map utilization status to text and colors from your config
const STATUS_MAP = {
  under: {
    label: 'Underutilized',
    color: 'bg-status-future', // #138DCC
  },
  over: {
    label: 'Overutilized',
    color: 'bg-status-ongoing', // #EDAC5E
  },
};

/**
 * A badge component to display resource utilization status.
 * @param {object} props
 * @param {'under' | 'over'} props.status - The utilization status.
 */
const UtilizationBadge = ({ status }) => {
  const { label, color } = STATUS_MAP[status] || { label: 'Unknown', color: 'bg-gray-300' };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                  ${color} text-gray-50 font-sans font-medium text-body-xs`}
    >
      {/* White circle icon */}
      <div className="w-3 h-3 bg-white rounded-full"></div>

      <span>{label}</span>
    </div>
  );
};

export default UtilizationBadge;
