import React from 'react';

const ResourceTableHeader = () => {
  const headers = [
    'Name',
    'Unit',
    'Role',
    'Generalization',
    'Specialization',
    'Current Allocation',
    'Billable Allocation',
  ];

  return (
    <thead className="bg-gray-100 border-b border-gray-200">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="text-primary-dark text-h4 font-medium px-4 py-3 text-left font-sans"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default ResourceTableHeader;
