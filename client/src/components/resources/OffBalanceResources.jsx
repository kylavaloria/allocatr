import React, { useState, useEffect } from 'react';
import CurrentAllocationBar from '../ui/CurrentAllocationBar';
import UtilizationBadge from '../ui/UtilizationBadge';
import { useResources } from '../../hooks/useResources';

const OffBalanceResources = () => {
  const [offBalanceResources, setOffBalanceResources] = useState([]);
  const { resources, loading, error, fetchResources } = useResources();

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (resources && resources.length > 0) {
      // Filter resources that are underutilized (<75%) or overutilized (>100%)
      const filtered = resources
        .filter(resource => {
          const allocation = resource.CurrentAllocation || 0;
          return allocation < 75 || allocation > 100;
        })
        .map(resource => ({
          id: resource.ResourceID,
          name: resource.Name,
          role: resource.Role,
          allocation: resource.CurrentAllocation || 0,
          utilization: resource.CurrentAllocation > 100 ? 'over' : 'under'
        }));

      setOffBalanceResources(filtered);
    }
  }, [resources]);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 font-sans">
        <h3 className="text-primary-dark text-h3 font-medium mb-4">
          Off-Balance Resources
        </h3>
        <div className="text-center text-gray-300 py-4">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 font-sans">
        <h3 className="text-primary-dark text-h3 font-medium mb-4">
          Off-Balance Resources
        </h3>
        <div className="text-center text-red-500 py-4">
          Error loading resources
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 font-sans">
      {/* Title */}
      <h3 className="text-primary-dark text-h3 font-medium mb-4">
        Off-Balance Resources
      </h3>

      {/* Resource List */}
      {offBalanceResources.length === 0 ? (
        <div className="text-center text-gray-300 py-4">
          All resources are balanced (75-100% allocation)
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {offBalanceResources.map((resource) => (
            <div key={resource.id} className="pb-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center justify-between gap-4">

                {/* Info */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-gray-300 text-body-md font-normal w-24 truncate">
                    {resource.name}
                  </span>
                  <span className="text-gray-300 text-body-md font-normal w-40 truncate">
                    {resource.role || 'N/A'}
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
      )}
    </div>
  );
};

export default OffBalanceResources;
