import React from 'react';
import DonutChart from './DonutChart';
import RevenueBar from './RevenueBar';

// Helper component for the top grid
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-300 text-body-md font-light">{label}</span>
    <span className="text-gray-300 text-h3 font-normal">{value}</span>
  </div>
);

const ResourceDetails = ({ resource, onClose }) => {
  // Mock data if no resource prop is passed
  const data = resource || {
    name: 'John Doe',
    role: 'Solutions Architect',
    unit: 'Technology Group',
    generalization: 'Solutions Engineering',
    specialization: 'Solutions Design, AI Workplace',
    capacity: 40,
    rateCard: 572,
    currentAllocation: 60.50,
    billableAllocation: 60.50,
    actualRevenue: 1000.15,
    maxRevenue: 2860.00,
    nextAvailability: 'October 10, 2025',
    forecastedRevenue: 1430.00
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8 relative font-sans">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-200 text-3xl font-bold hover:text-primary-dark"
        >
          ×
        </button>

        {/* --- Header --- */}
        <div className="mb-6">
          <h1 className="text-primary text-h1 font-medium">{data.name}</h1>
          <p className="text-gray-300 text-h3 font-normal">{data.role}</p>
        </div>

        {/* --- Main Details Grid --- */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <DetailItem label="Unit" value={data.unit} />
          <DetailItem label="Generalization" value={data.generalization} />
          <DetailItem label="Specialization" value={data.specialization} />
          <DetailItem label="Capacity per Week (Hours)" value={data.capacity} />
          <DetailItem label="Rate Card" value={`$${data.rateCard}`} />
        </div>

        {/* --- Bottom Stats Box --- */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-4 items-center">

            {/* Current Allocation */}
            <div className="flex flex-col items-center gap-2 px-2">
              <span className="text-gray-300 text-body-xs font-light">
                Current Allocation
              </span>
              <div className="relative">
                <DonutChart
                  value={data.currentAllocation}
                  colorClass="text-secondary-blue" // Using closest match #449F9D
                />
                <span className="absolute inset-0 flex items-center justify-center text-body font-normal text-gray-300">
                  {data.currentAllocation}%
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="h-24 border-l border-gray-200"></div>

            {/* Billable Allocation */}
            <div className="flex flex-col items-center gap-2 px-2">
              <span className="text-gray-300 text-body-xs font-light">
                Billable Allocation
              </span>
              <div className="relative">
                <DonutChart
                  value={data.billableAllocation}
                  colorClass="text-secondary-green" // #C4E78F
                />
                <span className="absolute inset-0 flex items-center justify-center text-body font-normal text-gray-300">
                  {data.billableAllocation}%
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="h-24 border-l border-gray-200"></div>

            {/* Revenue & Availability (Spans 2 logical columns, grid-cols-4 on parent) */}
            <div className="col-span-2 flex items-center pl-4">
              {/* Revenue Bar */}
              <div className="flex-1 pr-4">
                <span className="text-gray-300 text-body-xs font-light">
                  Actual vs Maximum Revenue
                </span>
                <RevenueBar
                  actual={data.actualRevenue}
                  max={data.maxRevenue}
                />
              </div>

              {/* Separator */}
              <div className="h-24 border-l border-gray-200"></div>

              {/* Availability */}
              <div className="flex flex-col gap-2 pl-4">
                <div>
                  <span className="block text-gray-300 text-body-xs font-light">Next Availability</span>
                  <span className="block text-gray-300 text-body-md font-normal">{data.nextAvailability}</span>
                </div>
                <div>
                  <span className="block text-gray-300 text-body-xs font-light">Forecasted Revenue</span>
                  <span className="block text-gray-300 text-body-md font-normal">
                    {`$${data.forecastedRevenue.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
