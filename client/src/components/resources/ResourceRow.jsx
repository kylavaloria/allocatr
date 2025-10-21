import React, { useState, useEffect, useRef, Fragment } from 'react';
import CurrentAllocationBar from '../ui/CurrentAllocationBar';
import BillableBar from '../ui/BillableBar';
import Action from '../ui/Action';
import ResourceModal from './ResourceModal'; // 1. Import the modal
import DeleteDialogue from '../ui/DeleteDialogue'; // 2. Import delete dialog

const ResourceRow = ({
  name,
  unit,
  role,
  generalization,
  specialization,
  currentAllocation,
  billableAllocation,
  isLastRow,
  isExpanded,
  onClick,
  // 3. We no longer need onEdit or onDelete props from the parent
}) => {
  // --- State for Action Dropdown ---
  const [isActionOpen, setIsActionOpen] = useState(false);
  const actionRef = useRef(null); // Ref for click-outside detection

  // --- 4. NEW STATE for Modals ---
  // This state will track *which* modal to show: 'edit', 'delete', or 'null'
  const [modalType, setModalType] = useState(null);

  // --- Click-outside-to-close logic for Action ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the ref exists and the click was *outside* the action menu
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setIsActionOpen(false); // Close the menu
      }
    };
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array so this only runs once

  // --- 5. UPDATED Handlers ---
  const handleEdit = () => {
    setModalType('edit'); // Set the local state to open the edit modal
    setIsActionOpen(false);
  };

  const handleDelete = () => {
    setModalType('delete'); // Set the local state to open the delete modal
    setIsActionOpen(false);
  };

  const closeModal = () => {
    setModalType(null); // Close any open modal
  };

  const handleConfirmDelete = () => {
    console.log('DELETING:', name);
    closeModal();
  };

  const handleSubmitEdit = () => {
    console.log('SUBMITTING EDIT:', name);
    closeModal();
  };

  // --- New logic for rounding ---
  const applyLastRowRounding = isLastRow && !isExpanded;

  // 6. Pack this row's data into an object for the modal
  const resourceData = {
    name,
    unit,
    role,
    generalization,
    specialization,
    currentAllocation,
    billableAllocation,
    // Add capacity and rateCard if they exist in your data
    // capacity: 40,
    // rateCard: 572,
  };

  return (
    // 7. Use a Fragment to render the row AND its modals
    <Fragment>
      <tr
        onClick={onClick} // Click handler for the whole row (to expand)
        className={`text-gray-300 text-body-sm font-normal font-sans border-t border-gray-200
                  cursor-pointer transition-colors
                  ${isExpanded ? 'bg-primary-lighter' : 'hover:bg-primary-lighter'}`}
      >
        <td className={`px-4 py-3 ${applyLastRowRounding ? 'rounded-bl-2xl' : ''}`}>
          {name}
        </td>
        <td className="px-4 py-3">{unit}</td>
        <td className="px-4 py-3">{role}</td>
        <td className="px-4 py-3">{generalization}</td>
        <td className="px-4 py-3">{specialization}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <CurrentAllocationBar value={currentAllocation} />
            <span>{currentAllocation}%</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <BillableBar value={billableAllocation} />
            <span>{billableAllocation}%</span>
          </div>
        </td>

        {/* --- Actions Column Updated --- */}
        <td
          className={`px-4 py-3 text-center ${
            applyLastRowRounding ? 'rounded-br-2xl' : ''
          }`}
        >
          {/* Wrap button and dropdown in a relative container */}
          <div
            className="relative inline-block"
            ref={actionRef}
            onClick={(e) => e.stopPropagation()} // Stops click from bubbling to the row
          >
            <button
              onClick={() => setIsActionOpen((prev) => !prev)} // Toggle state
              className="text-gray-300 p-1 rounded-full hover:text-primary-dark hover:bg-primary-lighter transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* --- Conditionally render Action dropdown --- */}
            {isActionOpen && (
              <Action onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        </td>
      </tr>

      {/* 8. RENDER THE MODALS (conditionally) */}
      {modalType === 'edit' && (
        <ResourceModal
          type="edit"
          resourceData={resourceData}
          onClose={closeModal}
          onSubmit={handleSubmitEdit}
        />
      )}
      {modalType === 'delete' && (
        <DeleteDialogue
          type="Resource"
          onClose={closeModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Fragment>
  );
};

export default ResourceRow;
