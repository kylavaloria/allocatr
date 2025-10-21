import React, { useState, Fragment } from 'react';
import ResourceTableHeader from './ResourceTableHeader';
import ResourceRow from './ResourceRow';
import TaskDrawer from '../tasks/TaskDrawer'; // Import the component to be shown

const ResourceTable = () => {
  const data = [
    {
      id: 1, // Added IDs for state management
      name: 'John Doe',
      unit: 'Technology Group',
      role: 'Solutions Architect',
      generalization: 'Solutions Engineering',
      specialization: 'Solutions Design, AI Workplace',
      currentAllocation: 60,
      billableAllocation: 60,
    },
    {
      id: 2,
      name: 'John Doe',
      unit: 'Technology Group',
      role: 'Solutions Architect',
      generalization: 'Solutions Engineering',
      specialization: 'Solutions Design, AI Workplace',
      currentAllocation: 60,
      billableAllocation: 60,
    },
    {
      id: 3,
      name: 'John Doe',
      unit: 'Technology Group',
      role: 'Solutions Architect',
      generalization: 'Solutions Engineering',
      specialization: 'Solutions Design, AI Workplace',
      currentAllocation: 60,
      billableAllocation: 60,
    },
  ];

  // --- State to track the currently expanded row ID ---
  // This can be an array if you want multiple rows open
  const [expandedRowIds, setExpandedRowIds] = useState([]);

  // --- Toggle the row ---
  const handleRowClick = (id) => {
    setExpandedRowIds((prevIds) => {
      // If the ID is already in the array, remove it (to close)
      if (prevIds.includes(id)) {
        return prevIds.filter((rowId) => rowId !== id);
      }
      // Otherwise, add it (to open)
      return [...prevIds, id];
    });
  };

  return (
    // Removed border and rounded-2xl, as parent (Resources.jsx) handles this
    <div className="w-full rounded-2xl border border-gray-200">
      {/* Added table-fixed for consistent column widths */}
      <table className="w-full border-collapse table-fixed ">
        <ResourceTableHeader />
        <tbody>
          {data.map((item, index) => {
            const isExpanded = expandedRowIds.includes(item.id);
            // Check if this is the last row for rounding
            const isLastRow = index === data.length - 1;

            return (
              // Use Fragment to render the row + its expanded content
              <Fragment key={item.id}>
                <ResourceRow
                  {...item} // Pass all data
                  isExpanded={isExpanded}
                  // This is the new logic for rounding:
                  // Only apply if it's the last row AND it's not expanded
                  isLastRow={isLastRow && !isExpanded}
                  onClick={() => handleRowClick(item.id)}
                  // No onEdit or onDelete props are needed here
                />

                {/* --- Conditionally render the expanded TaskDrawer --- */}
                {isExpanded && (
                  <tr>
                    {/* Full-width cell that spans all 8 columns */}
                    <td
                      colSpan={8}
                      className={`border-t border-gray-200 ${
                        isLastRow ? 'rounded-b-2xl' : ''
                      }`}
                    >
                      {/* Padding and background removed from here */}
                      <div
                        className={`${
                          isLastRow ? 'rounded-b-2xl' : ''
                        }`}
                      >
                        <TaskDrawer />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;
