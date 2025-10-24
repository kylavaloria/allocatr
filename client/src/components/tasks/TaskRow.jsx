import React, { useState, useEffect, useRef, Fragment } from 'react';
import AllocationBar from '../ui/AllocationBar';
import ProgressBar from '../ui/ProgressBar';
import BillableIndicator from '../ui/BillableIndicator';
import StatusBadge from '../ui/StatusBadge';
import Action from '../ui/Action';
import TaskModal from './TaskModal';
import DeleteDialogue from '../ui/DeleteDialogue';
import { useTasks } from '../../hooks/useTasks';
import { useHolidays } from '../../hooks/useHolidays';

const TaskRow = ({ task, onUpdate, availableResources = [] }) => {
  const [isActionOpen, setIsActionOpen] = useState(false);
  const actionRef = useRef(null);
  const [modalType, setModalType] = useState(null);
  const [workDays, setWorkDays] = useState(0);

  const { updateTask, deleteTask } = useTasks();
  const { holidays } = useHolidays();

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

  // Check if a date is a weekend (Saturday or Sunday)
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };

  // Check if a date is a holiday
  const isHoliday = (date) => {
    const dateTime = new Date(date).setHours(0, 0, 0, 0);
    return holidays.some(holiday => {
      const holidayTime = new Date(holiday.HolidayDate).setHours(0, 0, 0, 0);
      return holidayTime === dateTime;
    });
  };

  // Calculate work days between dates (excludes weekends and holidays)
  const calculateWorkDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // If start is after end, return 0
    if (start > end) return 0;

    let workingDays = 0;
    const current = new Date(start);

    while (current <= end) {
      // Check if current day is not a weekend and not a holiday
      if (!isWeekend(current) && !isHoliday(current)) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return workingDays;
  };

  // Calculate work days when task dates or holidays change
  useEffect(() => {
    if (task.StartDate && task.EndDate) {
      const days = calculateWorkDays(task.StartDate, task.EndDate);
      setWorkDays(days);
    }
  }, [task.StartDate, task.EndDate, holidays]);

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
          {workDays}
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
          availableResources={availableResources}
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
