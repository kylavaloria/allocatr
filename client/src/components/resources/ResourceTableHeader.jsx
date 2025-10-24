import React, { useState, useEffect, useRef } from 'react';
import FilterDropdown from '../filters/FilterDropdown';

const ResourceTableHeader = ({ resources = [], onFilterChange }) => {
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
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    Unit: [],
    Role: [],
    Generalization: [],
    Specialization: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    Unit: [],
    Role: [],
    Generalization: [],
    Specialization: [],
  });

  const headerRef = useRef(null);

  // Extract unique filter options from resources
  useEffect(() => {
    if (resources && resources.length > 0) {
      const options = {
        Unit: [...new Set(resources.map(r => r.Unit).filter(Boolean))].sort(),
        Role: [...new Set(resources.map(r => r.Role).filter(Boolean))].sort(),
        Generalization: [...new Set(resources.map(r => r.Generalization).filter(Boolean))].sort(),
        Specialization: [...new Set(resources.map(r => r.Specialization).filter(Boolean))].sort(),
      };
      setFilterOptions(options);
    }
  }, [resources]);

  // Apply filters when selectedFilters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);

  // --- Handlers ---
  const handleFilterClick = (header) => {
    setOpenFilter(openFilter === header ? null : header);
  };

  const handleFilterToggle = (filterName, option) => {
    const currentSelection = selectedFilters[filterName];
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter((item) => item !== option)
      : [...currentSelection, option];

    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: newSelection,
    }));
  };

  // --- Click-outside-to-close logic ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <thead ref={headerRef} className="border-b border-gray-200">
      <tr>
        {headers.map((header, index) => {
          const isFilterable = filterableHeaders.includes(header);
          const isOpen = openFilter === header;
          const isFirst = index === 0;
          const hasActiveFilter = isFilterable && selectedFilters[header]?.length > 0;

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
              widthClass = 'w-[20%]';
              break;
            case 'Current Allocation':
              widthClass = 'w-48';
              break;
            case 'Billable Allocation':
              widthClass = 'w-48';
              break;
          }

          return (
            <th
              key={header}
              className={`relative text-primary-dark body-sm font-medium px-4 py-3 text-left font-sans
                          ${isFirst ? 'rounded-tl-2xl' : ''}
                          ${widthClass}`}
            >
              {isFilterable ? (
                <button
                  onClick={() => handleFilterClick(header)}
                  className={`flex items-center gap-1.5 transition-colors
                             ${hasActiveFilter ? 'text-primary' : 'hover:text-primary'}`}
                >
                  <span>{header}</span>
                  {hasActiveFilter && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                      {selectedFilters[header].length}
                    </span>
                  )}
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
                  options={filterOptions[header] || []}
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
