import React from 'react';
import DonutChart from '../ui/DonutChart';
import RevenueBar from '../ui/RevenueBar';

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-300 text-body-md font-light">{label}</span>
    <span className="text-gray-300 text-h3 font-normal">{value || '-'}</span>
  </div>
);

const ResourceDetails = ({ resource, onClose }) => {
  const data = resource || {};

  const currentAllocation = data.currentAllocation || data.CurrentAllocation || 0;
  const billableAllocation = data.billableAllocation || data.BillableAllocation || 0;
  const actualRevenue = data.actualRevenueThisWeek || data.ActualRevenueThisWeek || 0;
  const maxRevenue = data.maxRevenuePerWeek || data.MaxRevenuePerWeek || 0;
  const forecastedRevenue = data.forecastedRevenue || data.ForecastedRevenue || 0;

  // Format next availability date
  const formatDate = (dateString) => {
    if (!dateString) return 'Available Now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    return `$${(value || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-30 z-50 overflow-y-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 relative font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-200 text-3xl font-bold hover:text-primary-dark"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-primary text-h1 font-medium">
            {data.name || data.Name || 'N/A'}
          </h1>
          <p className="text-gray-300 text-h3 font-normal">
            {data.role || data.Role || 'N/A'}
          </p>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <DetailItem
            label="Unit"
            value={data.unit || data.Unit}
          />
          <DetailItem
            label="Generalization"
            value={data.generalization || data.Generalization}
          />
          <DetailItem
            label="Specialization"
            value={data.specialization || data.Specialization}
          />
          <DetailItem
            label="Capacity per Week (Hours)"
            value={data.capacity || data.CapacityPerWeek}
          />
          <DetailItem
            label="Rate Card"
            value={formatCurrency(data.rateCard || data.RateCard)}
          />
        </div>

        {/* Bottom Stats Box */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-3">

            {/* Column 1: Current Allocation */}
            <div className="flex flex-col items-center gap-2 w-1/4 px-2">
              <span className="text-gray-300 text-body-xs font-light text-center">
                Current Allocation
              </span>
              <div className="relative">
                <DonutChart
                  value={currentAllocation}
                  colorClass="text-secondary-blue"
                />
                <span className="absolute inset-0 flex items-center justify-center text-body font-normal text-gray-300">
                  {currentAllocation.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="h-24 border-l border-gray-200 self-center"></div>

            {/* Column 2: Billable Allocation */}
            <div className="flex flex-col items-center gap-2 w-1/4 px-2">
              <span className="text-gray-300 text-body-xs font-light text-center">
                Billable Allocation
              </span>
              <div className="relative">
                <DonutChart
                  value={billableAllocation}
                  colorClass="text-secondary-green"
                />
                <span className="absolute inset-0 flex items-center justify-center text-body font-normal text-gray-300">
                  {billableAllocation.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="h-24 border-l border-gray-200 self-center"></div>

            {/* Column 3: Revenue Bar */}
            <div className="flex flex-col gap-2 w-1/4 px-2">
              <span className="text-gray-300 text-body-xs font-light text-center">
                Actual vs Maximum Revenue
              </span>
              <RevenueBar
                actual={actualRevenue}
                max={maxRevenue}
              />
            </div>

            {/* Separator */}
            <div className="h-24 border-l border-gray-200 self-center"></div>

            {/* Column 4: Availability */}
            <div className="flex flex-col gap-2 w-1/4 px-2">
              <div>
                <span className="block text-gray-300 text-body-xs font-light">
                  Next Availability
                </span>
                <span className="block text-gray-300 text-body-md font-normal">
                  {formatDate(data.nextAvailability || data.NextAvailability)}
                </span>
              </div>
              <div>
                <span className="block text-gray-300 text-body-xs font-light">
                  Forecasted Revenue
                </span>
                <span className="block text-gray-300 text-body-md font-normal">
                  {formatCurrency(forecastedRevenue)}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
