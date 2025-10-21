import React from 'react';

const TaskHeader = () => {
  const headers = [
    'Task',
    'Type',
    'Schedule',
    'Work Days',
    'Allocation',
    'Progress',
    'Billable',
    'Status',
  ];

  return (
    <thead className="font-sans">
      <tr>
        {headers.map((header) => {
          // --- Logic for assigning widths ---
          let widthClass = '';
          switch (header) {
            case 'Task':
              widthClass = 'w-[25%]'; // Widest column
              break;
            case 'Type':
              widthClass = 'w-[10%]';
              break;
            case 'Schedule':
              widthClass = 'w-[15%]';
              break;
            case 'Work Days':
              widthClass = 'w-[11%]';
              break;
            case 'Allocation':
              widthClass = 'w-48'; // Fixed width for bar
              break;
            case 'Progress':
              widthClass = 'w-48'; // Fixed width for bar
              break;
            case 'Billable':
              widthClass = 'w-28'; // Fixed width for indicator
              break;
            case 'Status':
              widthClass = 'w-36'; // Fixed width for badge
              break;
          }

          return (
            <th
              key={header}
              className={`text-primary-dark text-body-md font-medium px-4 py-3 text-left ${widthClass}`} // <-- Width class added
            >
              {header}
            </th>
          );
        })}
        {/* Empty header for the actions (ellipsis) column */}
        <th className="px-4 py-3 w-16"> {/* <-- Width added */}
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
};

export default TaskHeader;
