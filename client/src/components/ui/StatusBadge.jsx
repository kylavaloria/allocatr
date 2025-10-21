import React from 'react';

// Define status types for better prop management and to match the image text
const STATUS_TYPES = {
  done: 'Done',
  future: 'Future Work',
  leave: 'Leave',
  ongoing: 'Ongoing',
  paused: 'Paused',
};

// Map status keys to Tailwind background colors from your config
const STATUS_COLORS = {
  done: 'bg-status-done',
  future: 'bg-status-future',
  leave: 'bg-status-leave',
  ongoing: 'bg-status-ongoing',
  paused: 'bg-status-paused',
};

/**
 * A badge component to display task or project status.
 * @param {object} props
 * @param {keyof STATUS_TYPES} props.status - The status key (e.g., "done", "ongoing").
 */
const StatusBadge = ({ status = 'future' }) => {
  const label = STATUS_TYPES[status] || 'Unknown';
  const bgColor = STATUS_COLORS[status] || 'bg-gray-300'; // Default color if status is unknown

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                  ${bgColor} text-gray-50 font-sans font-medium text-body-xs`}
    >
      {/* White circle icon */}
      <div className="w-3 h-3 bg-white rounded-full"></div>

      <span>{label}</span>
    </div>
  );
};

export default StatusBadge;
