import React, { useState, useEffect, useRef, Fragment } from 'react';
import AllocationBar from '../ui/AllocationBar';
import ProgressBar from '../ui/ProgressBar';
import BillableIndicator from '../ui/BillableIndicator';
import StatusBadge from '../ui/StatusBadge';
import Action from '../ui/Action';
import TaskModal from './TaskModal';
import DeleteDialogue from '../ui/DeleteDialogue';
import { useTasks } from '../../hooks/useTasks';

const TaskRow = ({ task, onUpdate }) => {
  const [isActionOpen, setIsActionOpen] = useState(false);
  const actionRef = useRef(null);
  const [modalType, setModalType] = useState(null);

  const { updateTask, deleteTask } = useTasks();

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate work days between dates
  const calculateWorkDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Map TaskStatus to status badge format
  const getStatusKey = (taskStatus) => {
    const statusMap = {
      'Done': 'done',
      'Future Work': 'future',
      'Leave': 'leave',
      'Ongoing': 'ongoing',
      'Paused': 'paused'
    };
    return statusMap[taskStatus] || 'ongoing';
  };

  // Click-outside-to-close logic
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

  const closeModal = () => {
    setModalType(null);
  };

  const handleSubmitEdit = async (taskData) => {
    const result = await updateTask(task.TaskID, taskData);
    if (result.success) {
      console.log('Task updated successfully');
      closeModal();
      if (onUpdate) onUpdate();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleConfirmDelete = async () => {
    const result = await deleteTask(task.TaskID);
    if (result.success) {
      console.log('Task deleted successfully');
      closeModal();
      if (onUpdate) onUpdate();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <Fragment>
      <tr className="text-gray-300 text-body-xs font-normal font-sans border-b border-gray-200 last:border-b-0">
        {/* Task Name */}
        <td className="px-4 py-3 align-top">
          {task.TaskName || 'Untitled Task'}
        </td>

        {/* Type */}
        <td className="px-4 py-3 align-top whitespace-nowrap">
          {task.TaskType || '-'}
        </td>

        {/* Schedule */}
        <td className="px-4 py-3 align-top whitespace-nowrap">
          {formatDate(task.StartDate)} - {formatDate(task.EndDate)}
        </td>

        {/* Work Days */}
        <td className="px-4 py-3 align-top">
          {calculateWorkDays(task.StartDate, task.EndDate)}
        </td>

        {/* Allocation */}
        <td className="px-4 py-3 align-top">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <AllocationBar value={task.TaskAllocationPercentage || 0} />
            <span>{task.TaskAllocationPercentage || 0}%</span>
          </div>
        </td>

        {/* Progress */}
        <td className="px-4 py-3 align-top">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <ProgressBar value={task.TaskProgress || 0} />
            <span>{task.TaskProgress || 0}%</span>
          </div>
        </td>

        {/* Billable */}
        <td className="px-4 py-3 align-top">
          <BillableIndicator isBillable={task.Billable === true || task.Billable === 1} />
        </td>

        {/* Status */}
        <td className="px-4 py-3 align-top">
          <StatusBadge status={getStatusKey(task.TaskStatus)} />
        </td>

        {/* Actions */}
        <td className="px-4 py-3 align-top text-center">
          <div
            className="relative inline-block"
            ref={actionRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsActionOpen((prev) => !prev)}
              className="text-gray-300 p-1 rounded-full hover:text-primary-dark transition-colors"
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

            {isActionOpen && (
              <Action onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        </td>
      </tr>

      {/* Modals */}
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
