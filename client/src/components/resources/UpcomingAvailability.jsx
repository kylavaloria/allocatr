import React, { useState, useEffect } from 'react';
import CurrentAllocationBar from '../ui/CurrentAllocationBar';
import { useResources } from '../../hooks/useResources';

const UpcomingAvailability = () => {
  const [upcomingResources, setUpcomingResources] = useState([]);
  const { resources, loading, error, fetchResources } = useResources();

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (resources && resources.length > 0) {
      // Sort resources by NextAvailability date (earliest first)
      const sorted = [...resources]
        .filter(resource => resource.NextAvailability) // Only include resources with availability date
        .sort((a, b) => {
          const dateA = new Date(a.NextAvailability);
          const dateB = new Date(b.NextAvailability);
          return dateA - dateB;
        })
        .slice(0, 10) // Show top 10 upcoming availabilities
        .map(resource => ({
          id: resource.ResourceID,
          name: resource.Name,
          role: resource.Role,
          allocation: resource.CurrentAllocation || 0,
          nextAvailable: formatDate(resource.NextAvailability)
        }));

      setUpcomingResources(sorted);
    }
  }, [resources]);

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'Available Now';
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availDate = new Date(date);
    availDate.setHours(0, 0, 0, 0);

    // If date is today or in the past
    if (availDate <= today) {
      return 'Available Now';
    }

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 font-sans">
        <h3 className="text-primary-dark text-h3 font-medium mb-4">
          Upcoming Availability
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
          Upcoming Availability
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
        Upcoming Availability
      </h3>

      {/* Resource List */}
      {upcomingResources.length === 0 ? (
        <div className="text-center text-gray-300 py-4">
          No upcoming availability data
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {upcomingResources.map((resource) => (
            <div key={resource.id} className="pb-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center justify-between gap-6">

                {/* Info */}
                <span className="text-gray-300 text-body-md font-normal w-24 truncate">
                  {resource.name}
                </span>
                <span className="text-gray-300 text-body-md font-normal w-40 truncate">
                  {resource.role || 'N/A'}
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
      )}
    </div>
  );
};

export default UpcomingAvailability;
