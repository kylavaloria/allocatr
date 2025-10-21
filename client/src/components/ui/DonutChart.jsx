import React from 'react';

/**
 * Renders an SVG-based donut chart.
 * @param {object} props
 * @param {number} props.value - The percentage value (0-100).
 * @param {string} props.colorClass - The Tailwind text color class for the stroke (e.g., "text-secondary-blue").
 */
const DonutChart = ({ value, colorClass }) => {
  const radius = 50;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      className="-rotate-90"
    >
      {/* Background Track */}
      <circle
        className="text-gray-200" // #B3CCDA
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {/* Progress Fill */}
      <circle
        className={colorClass} // The dynamic color
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeLinecap="round"
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset,
          transition: 'stroke-dashoffset 0.3s ease',
        }}
      />
    </svg>
  );
};

export default DonutChart;
