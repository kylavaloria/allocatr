import React, { useState, useEffect, useRef, Fragment } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for portal
import CurrentAllocationBar from '../ui/CurrentAllocationBar'; // Corrected import based on previous files
import BillableBar from '../ui/BillableBar';
import Action from '../ui/Action';
import ResourceModal from './ResourceModal'; // Import the resource modal
import DeleteDialogue from '../ui/DeleteDialogue';
import ResourceDetails from './ResourceDetails'; // Import ResourceDetails

// This component accepts individual props related to a RESOURCE
const ResourceRow = ({
  id,
  name,
  unit,
  role,
  generalization,
  specialization,
  currentAllocation,
  billableAllocation,
  capacity, // Example: Pass any other needed fields
  rateCard, // Example: Pass any other needed fields
  isLastRow,
  isExpanded,
  onClick, // For expanding the row
}) => {
  // State for Action Dropdown
  const [isActionOpen, setIsActionOpen] = useState(false);
  const actionRef = useRef(null);

  // State for Modals ('edit', 'delete', 'details', or null)
  const [modalType, setModalType] = useState(null);

  // Click-outside-to-close logic for Action Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setIsActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Modal Handlers
  const handleEdit = () => { setModalType('edit'); setIsActionOpen(false); };
  const handleDelete = () => { setModalType('delete'); setIsActionOpen(false); };
  const handleOpenDetails = (e) => {
    e.stopPropagation(); // Stop row onClick (expand)
    setModalType('details');
  };
  const closeModal = () => { setModalType(null); };

  const handleSubmitEdit = () => { console.log('SUBMITTING EDIT:', name); closeModal(); };
  const handleConfirmDelete = () => { console.log('DELETING:', name); closeModal(); };

  // Rounding Logic
  const applyLastRowRounding = isLastRow && !isExpanded;

  // Data object for modals, using the RESOURCE props
  const resourceData = {
    id, name, unit, role, generalization, specialization,
    currentAllocation, billableAllocation, capacity, rateCard
  };

  return (
    <Fragment>
      {/* Table Row */}
      <tr
        onClick={onClick} // Row click expands/collapses TaskDrawer
        className={`text-gray-300 text-body-md font-normal font-sans border-t border-gray-200
                    cursor-pointer transition-colors
                    ${isExpanded ? 'bg-primary-lighter' : 'hover:bg-primary-lighter'}`}
      >
        {/* Name Cell */}
        <td className={`px-4 py-3 ${applyLastRowRounding ? 'rounded-bl-2xl' : ''}`}>
          <button
            onClick={handleOpenDetails}
            className="hover:underline hover:text-primary focus:outline-none focus:text-primary transition-colors"
          >
            {name} {/* Uses the 'name' prop */}
          </button>
        </td>

        {/* Other Resource Data Cells */}
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

        {/* Actions Cell */}
        <td className={`px-4 py-3 text-center ${applyLastRowRounding ? 'rounded-br-2xl' : ''}`}>
          <div
            className="relative inline-block"
            ref={actionRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsActionOpen((prev) => !prev)}
              className="text-gray-300 p-1 rounded-full hover:text-primary-dark hover:bg-primary-lighter transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {isActionOpen && <Action onEdit={handleEdit} onDelete={handleDelete} />}
          </div>
        </td>
      </tr>

      {/* RENDER MODALS IN PORTAL */}
      {modalType === 'edit' && ReactDOM.createPortal(
        <ResourceModal
          type="edit"
          resourceData={resourceData}
          onClose={closeModal}
          onSubmit={handleSubmitEdit}
        />,
        document.getElementById('modal-root')
      )}
      {modalType === 'delete' && ReactDOM.createPortal(
        <DeleteDialogue
          type="Resource"
          onClose={closeModal}
          onConfirm={handleConfirmDelete}
        />,
        document.getElementById('modal-root')
      )}
      {modalType === 'details' && ReactDOM.createPortal(
        <ResourceDetails
          resource={resourceData}
          onClose={closeModal}
        />,
        document.getElementById('modal-root')
      )}
    </Fragment>
  );
};

export default ResourceRow;
