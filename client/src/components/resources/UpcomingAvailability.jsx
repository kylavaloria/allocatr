import React from 'react';
import CurrentAllocationBar from '../ui/CurrentAllocationBar';

const UpcomingAvailability = () => {
  // Mock data based on the image
  const resources = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Solutions Architect',
      allocation: 60,
      nextAvailable: 'October 15, 2025',
    },
    {
      id: 2,
      name: 'John Doe',
      role: 'Solutions Architect',
      allocation: 60,
      nextAvailable: 'October 15, 2025',
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 font-sans">

      {/* Title */}
      <h3 className="text-primary-dark text-h3 font-medium mb-4">
        Upcoming Availability
      </h3>

      {/* Resource List */}
      <div className="flex flex-col gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="pb-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between gap-6">

              {/* Info */}
              <span className="text-gray-300 text-body-md font-normal w-24 truncate">
                {resource.name}
              </span>
              <span className="text-gray-300 text-body-md font-normal w-40 truncate">
                {resource.role}
              </span>

              {/* Bar */}
              <div className="flex items-center gap-2 flex-grow">
                <CurrentAllocationBar value={resource.allocation} />
                <span className="text-gray-300 text-body-md font-normal">
                  {resource.allocation}%
                </span>
              </div>

              {/* Date */}
              <span className="text-gray-300 text-body-md font-normal whitespace-nowrap">
                {resource.nextAvailable}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAvailability;
