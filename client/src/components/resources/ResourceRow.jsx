import React, { useState, useEffect, useRef, Fragment } from 'react';
import ReactDOM from 'react-dom';
import CurrentAllocationBar from '../ui/CurrentAllocationBar';
import BillableBar from '../ui/BillableBar';
import Action from '../ui/Action';
import ResourceModal from './ResourceModal';
import DeleteDialogue from '../ui/DeleteDialogue';
import ResourceDetails from './ResourceDetails';
import { useResources } from '../../hooks/useResources';

const ResourceRow = ({
  id,
  name,
  unit,
  role,
  generalization,
  specialization,
  currentAllocation,
  billableAllocation,
  capacity,
  rateCard,
  nextAvailability,
  maxRevenuePerWeek,
  actualRevenueThisWeek,
  forecastedRevenue,
  isLastRow,
  isExpanded,
  onClick,
  onUpdate,
  onDelete,
  onRefresh
}) => {
  const [isActionOpen, setIsActionOpen] = useState(false);
  const actionRef = useRef(null);
  const [modalType, setModalType] = useState(null);
  const [detailsData, setDetailsData] = useState(null);

  const { fetchResourceDetails, updateResource, deleteResource } = useResources();

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
  const handleEdit = () => {
    setModalType('edit');
    setIsActionOpen(false);
  };

  const handleDelete = () => {
    setModalType('delete');
    setIsActionOpen(false);
  };

  const handleOpenDetails = async (e) => {
    e.stopPropagation();
    const details = await fetchResourceDetails(id);
    if (details) {
      setDetailsData(details);
      setModalType('details');
    }
  };

  const closeModal = () => {
    setModalType(null);
    setDetailsData(null);
  };

  const handleSubmitEdit = async (resourceData) => {
    const result = await updateResource(id, resourceData);
    if (result.success) {
      console.log('Resource updated successfully');
      closeModal();
      if (onRefresh) onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleConfirmDelete = async () => {
    const result = await deleteResource(id);
    if (result.success) {
      console.log('Resource deleted successfully');
      closeModal();
      if (onRefresh) onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  // Rounding Logic
  const applyLastRowRounding = isLastRow && !isExpanded;

  // Data object for modals
  const resourceData = {
    ResourceID: id,
    Name: name,
    Unit: unit,
    Role: role,
    Generalization: generalization,
    Specialization: specialization,
    CapacityPerWeek: capacity,
    RateCard: rateCard
  };

  return (
    <Fragment>
      {/* Table Row */}
      <tr
        onClick={onClick}
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
            {name}
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
      {modalType === 'details' && detailsData && ReactDOM.createPortal(
        <ResourceDetails
          resource={detailsData.resource}
          onClose={closeModal}
        />,
        document.getElementById('modal-root')
      )}
    </Fragment>
  );
};

export default ResourceRow;
