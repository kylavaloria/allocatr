import React from 'react';
import CurrentAllocationBar from '../ui/CurrentAllocationBar';
import UtilizationBadge from '../ui/UtilizationBadge';

const OffBalanceResources = () => {
  // Mock data based on the image
  const resources = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Solutions Architect',
      allocation: 60,
      utilization: 'under', // 'under' or 'over'
    },
    {
      id: 2,
      name: 'John Doe',
      role: 'Solutions Architect',
      allocation: 60,
      utilization: 'over',
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 font-sans ">

      {/* Title */}
      <h3 className="text-primary-dark text-h3 font-medium mb-4">
        Off-Balance Resources
      </h3>

      {/* Resource List */}
      <div className="flex flex-col gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="pb-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between gap-4">

              {/* Info */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-gray-300 text-body-md font-normal w-24 truncate">
                  {resource.name}
                </span>
                <span className="text-gray-300 text-body-md font-normal w-40 truncate">
                  {resource.role}
                </span>
              </div>

              {/* Bar */}
              <div className="flex items-center gap-2 w-40 flex-grow">
                <CurrentAllocationBar value={resource.allocation} />
                <span className="text-gray-300 text-body-md font-normal">
                  {resource.allocation}%
                </span>
              </div>

              {/* Badge */}
              <div className="flex-shrink-0">
                <UtilizationBadge status={resource.utilization} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffBalanceResources;
