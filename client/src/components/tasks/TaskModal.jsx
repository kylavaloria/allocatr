import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ErrorMessage from '../ui/ErrorMessage';

const TaskModal = ({
  type = 'add',
  taskData = null,
  onClose,
  onSubmit,
  availableResources = [] // Add this prop to receive resources
}) => {
  const title = type === 'edit' ? 'Edit Task' : 'Assign Task';
  const [formData, setFormData] = useState({
    taskName: taskData?.TaskName || '',
    resourceId: taskData?.ResourceID ? taskData.ResourceID.toString() : '',
    taskType: taskData?.TaskType || '',
    taskStatus: taskData?.TaskStatus || 'Ongoing',
    startDate: taskData?.StartDate ? new Date(taskData.StartDate).toISOString().split('T')[0] : '',
    endDate: taskData?.EndDate ? new Date(taskData.EndDate).toISOString().split('T')[0] : '',
    billable: taskData?.Billable ? 'true' : 'false',
    taskAllocationHours: taskData?.TaskAllocationHours || '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      const firstInvalidField = form.querySelector(':invalid');
      let fieldLabel = 'A required field';

      if (firstInvalidField) {
        const fieldContainer = firstInvalidField.closest('.flex.flex-col.gap-2');
        const labelElement = fieldContainer?.querySelector('label');
        if (labelElement) {
          fieldLabel = labelElement.textContent.replace('*','').trim();
        }
      }

      setError(`Please fill out the '${fieldLabel}' field.`);
      return;
    }

    // Prepare data for API submission
    const dataToSubmit = {
      TaskName: formData.taskName,
      ResourceID: parseInt(formData.resourceId),
      TaskType: formData.taskType,
      TaskStatus: formData.taskStatus,
      StartDate: formData.startDate,
      EndDate: formData.endDate,
      Billable: formData.billable === 'true',
      TaskAllocationHours: parseFloat(formData.taskAllocationHours),
      ...(type === 'edit' && taskData?.TaskID && { TaskID: taskData.TaskID })
    };

    setError(null);
    console.log("Submitting:", dataToSubmit);
    onSubmit(dataToSubmit);
  };

  // Dropdown options
  const taskStatusOptions = [
    { value: 'Done', label: 'Done' },
    { value: 'Future Work', label: 'Future Work' },
    { value: 'Leave', label: 'Leave' },
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'Paused', label: 'Paused' }
  ];

  const taskTypeOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Community', label: 'Community' },
    { value: 'Learning', label: 'Learning' },
    { value: 'Managed Services', label: 'Managed Services' },
    { value: 'Mentoring', label: 'Mentoring' },
    { value: 'Others', label: 'Others' },
    { value: 'Pre-sales', label: 'Pre-sales' },
    { value: 'Program', label: 'Program' },
    { value: 'Project', label: 'Project' }
  ];

  const billableOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  // Convert available resources to dropdown options
  const resourceOptions = availableResources.map(resource => ({
    value: resource.ResourceID.toString(),
    label: `${resource.Name}${resource.Role ? ` - ${resource.Role}` : ''}`
  }));

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-30 z-50 overflow-y-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 text-2xl font-bold hover:text-primary-dark"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-primary text-h2 font-sans mb-6">{title}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Task Name"
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
            required
          />

          <Select
            label="Resource"
            name="resourceId"
            options={resourceOptions}
            value={formData.resourceId}
            onChange={handleChange}
            required
          />

          <Select
            label="Task Type"
            name="taskType"
            options={taskTypeOptions}
            value={formData.taskType}
            onChange={handleChange}
            required
          />

          <Select
            label="Status"
            name="taskStatus"
            options={taskStatusOptions}
            value={formData.taskStatus}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={formData.startDate}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Billable"
              name="billable"
              options={billableOptions}
              value={formData.billable}
              onChange={handleChange}
              required
            />
            <Input
              label="Task Allocation (Hr/s)"
              type="number"
              name="taskAllocationHours"
              value={formData.taskAllocationHours}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              max="24"
            />
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <ErrorMessage title="Validation Error" message={error} />
            <Button label="Done" type="submit" className="w-full" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
