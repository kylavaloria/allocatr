import React, { useState, useEffect, useRef, Fragment } from 'react';
import AllocationBar from '../ui/AllocationBar';
import ProgressBar from '../ui/ProgressBar';
import BillableIndicator from '../ui/BillableIndicator';
import StatusBadge from '../ui/StatusBadge';
import Action from '../ui/Action';
import TaskModal from './TaskModal'; // 1. Import modals
import DeleteDialogue from '../ui/DeleteDialogue';

const TaskRow = ({ task }) => {
  // --- 2. State for Action Dropdown ---
  const [isActionOpen, setIsActionOpen] = useState(false);
  const actionRef = useRef(null); // Ref for click-outside detection

  // --- 3. NEW STATE for Modals ---
  const [modalType, setModalType] = useState(null);

  // --- 4. Click-outside-to-close logic ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setIsActionOpen(false); // Close the menu
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- 5. UPDATED Modal Handlers ---
  const handleEdit = () => {
    setModalType('edit'); // Open edit modal
    setIsActionOpen(false);
  };

  const handleDelete = () => {
    setModalType('delete'); // Open delete modal
    setIsActionOpen(false);
  };

  const closeModal = () => {
    setModalType(null); // Close any modal
  };

  const handleSubmitEdit = () => {
    console.log('SUBMITTING EDIT for task:', task.name);
    closeModal();
  };

  const handleConfirmDelete = () => {
    console.log('DELETING task:', task.name);
    closeModal();
  };

  return (
    // 6. Use Fragment to render the row AND its modals
    <Fragment>
      <tr className="text-gray-300 text-body-xs font-normal font-sans border-b border-gray-200 last:border-b-0">
        {/* Task */}
        <td className="px-4 py-3 align-top">{task.name}</td>

        {/* Type */}
        <td className="px-4 py-3 align-top whitespace-nowrap">{task.type}</td>

        {/* Schedule */}
        <td className="px-4 py-3 align-top whitespace-nowrap">
          {task.schedule}
        </td>

        {/* Work Days */}
        <td className="px-4 py-3 align-top">{task.workDays}</td>

        {/* Allocation */}
        <td className="px-4 py-3 align-top">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <AllocationBar value={task.allocation} />
            <span>{task.allocation}%</span>
          </div>
        </td>

        {/* Progress */}
        <td className="px-4 py-3 align-top">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <ProgressBar value={task.progress} />
            <span>{task.progress}%</span>
          </div>
        </td>

        {/* Billable */}
        <td className="px-4 py-3 align-top">
          <BillableIndicator isBillable={task.isBillable} />
        </td>

        {/* Status */}
        <td className="px-4 py-3 align-top">
          <StatusBadge status={task.status} />
        </td>

        {/* --- 7. Actions Column Updated --- */}
        <td className="px-4 py-3 align-top text-center">
          {/* Wrap button and dropdown in a relative container */}
          <div
            className="relative inline-block"
            ref={actionRef}
            onClick={(e) => e.stopPropagation()} // Stop click from bubbling
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
        <TaskModal
          type="edit"
          taskData={task}
          onClose={closeModal}
          onSubmit={handleSubmitEdit}
        />
      )}
      {modalType === 'delete' && (
        <DeleteDialogue
          type="Task"
          onClose={closeModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Fragment>
  );
};

export default TaskRow;
