import React from 'react';
import AllocationBar from './AllocationBar';
import BillableBar from './BillableBar';

const ResourceRow = ({ name, unit, role, generalization, specialization, currentAllocation, billableAllocation }) => {
  return (
    <tr className="text-gray-300 text-body-md font-normal font-sans border-b border-gray-200">
      <td className="px-4 py-3">{name}</td>
      <td className="px-4 py-3">{unit}</td>
      <td className="px-4 py-3">{role}</td>
      <td className="px-4 py-3">{generalization}</td>
      <td className="px-4 py-3">{specialization}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <AllocationBar value={currentAllocation} />
          <span>{currentAllocation}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <BillableBar value={billableAllocation} />
          <span>{billableAllocation}%</span>
        </div>
      </td>
    </tr>
  );
};

export default ResourceRow;
