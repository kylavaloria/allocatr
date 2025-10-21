import React, { useState, useEffect, useRef } from 'react';
import FilterDropdown from '../filters/FilterDropdown';

// Mock data for the filters. In a real app, you'd pass this in or fetch it.
const mockFilterData = {
  Unit: ['Technology Group', 'Product', 'Sales', 'Marketing'],
  Role: ['Solutions Architect', 'Sr. DevOps Engineer', 'Product Manager', 'Designer'],
  Generalization: ['Solutions Engineering', 'Cloud Infra', 'Frontend', 'Backend'],
  Specialization: ['Solutions Design, AI Workplace', 'AWS', 'React', 'Node.js'],
};

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
  const filterableHeaders = ['Unit', 'Role', 'Generalization', 'Specialization'];

  // --- State for filter functionality ---

  // Tracks which filter dropdown is currently open (e.g., "Unit")
  const [openFilter, setOpenFilter] = useState(null);

  // Tracks the selected options for *all* filters
  const [selectedFilters, setSelectedFilters] = useState({
    Unit: [],
    Role: [],
    Generalization: [],
    Specialization: [],
  });

  // Ref for click-outside detection
  const headerRef = useRef(null);

  // --- Handlers ---

  // Toggles the correct filter dropdown
  const handleFilterClick = (header) => {
    setOpenFilter(openFilter === header ? null : header);
  };

  // Toggles a single checkbox option within a filter
  const handleFilterToggle = (filterName, option) => {
    const currentSelection = selectedFilters[filterName];
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter((item) => item !== option) // Remove item
      : [...currentSelection, option]; // Add item

    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: newSelection,
    }));
  };

  // --- Click-outside-to-close logic ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the ref exists and the click was *outside* the header component
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenFilter(null); // Close any open filter
      }
    };
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array so this only runs once

  return (
    // Add ref to the thead for click-outside detection
    <thead ref={headerRef} className=" border-b border-gray-200">
      <tr>
        {headers.map((header, index) => {
          const isFilterable = filterableHeaders.includes(header);
          const isOpen = openFilter === header;
          const isFirst = index === 0;

          // --- Assign widths to each header ---
          let widthClass = '';
          switch(header) {
            case 'Name':
              widthClass = 'w-[15%]';
              break;
            case 'Unit':
              widthClass = 'w-[18%]';
              break;
            case 'Role':
              widthClass = 'w-[18%]';
              break;
            case 'Generalization':
              widthClass = 'w-[20%]';
              break;
            case 'Specialization':
              widthClass = 'w-[20%]'; // Make this one wider
              break;
            case 'Current Allocation':
              widthClass = 'w-48'; // Fixed width for bar
              break;
            case 'Billable Allocation':
              widthClass = 'w-48'; // Fixed width for bar
              break;
          }

          return (
            <th
              key={header}
              className={`relative text-primary-dark body-sm font-semibold px-4 py-3 text-left font-sans
                          ${isFirst ? 'rounded-tl-2xl' : ''}
                          ${widthClass}`} // Width class applied here
            >
              {isFilterable ? (
                <button
                  onClick={() => handleFilterClick(header)}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <span>{header}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              ) : (
                <span>{header}</span>
              )}

              {/* --- Render the dropdown if this filter is open --- */}
              {isOpen && (
                <FilterDropdown
                  options={mockFilterData[header] || []}
                  selectedOptions={selectedFilters[header]}
                  onToggle={(option) => handleFilterToggle(header, option)}
                />
              )}
            </th>
          );
        })}
        {/* Fixed width for the actions column + rounding */}
        <th className="px-4 py-3 rounded-tr-2xl w-16">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
};

export default ResourceTableHeader;
