import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import ErrorMessage from '../ui/ErrorMessage';

const TaskModal = ({ type = 'add', taskData = null, onClose, onSubmit }) => {
  const title = type === 'edit' ? 'Edit Task' : 'Assign Task';
  const [formData, setFormData] = useState({
    taskName: taskData?.TaskName || '',
    resourceId: taskData?.ResourceID || '',
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
      let fieldLabel = 'A required field'; // Default message

      if (firstInvalidField) {
        // Go up to the parent container (the div with flex flex-col gap-2)
        const fieldContainer = firstInvalidField.closest('.flex.flex-col.gap-2');
        // Find the label within that container
        const labelElement = fieldContainer?.querySelector('label');
        if (labelElement) {
          // Get the label text and remove the asterisk and extra spaces
          fieldLabel = labelElement.textContent.replace('*','').trim();
        }
      }

      setError(`Please fill out the '${fieldLabel}' field.`);
      // Optionally focus
      // firstInvalidField?.focus();
      return;
    }

    // --- Data processing ---
    const dataToSubmit = {
      // ...(same as before)...
      ...formData,
      Billable: formData.billable === 'true',
      TaskAllocationHours: parseFloat(formData.taskAllocationHours) || null,
      ResourceID: parseInt(formData.resourceId) || null,
      ...(type === 'edit' && taskData?.TaskID && { TaskID: taskData.TaskID })
    };
    Object.keys(dataToSubmit).forEach(key => {
        if (dataToSubmit[key] === '') { dataToSubmit[key] = null; }
    });
    // --- End Data processing ---

    setError(null);
    console.log("Submitting:", dataToSubmit);
    onSubmit(dataToSubmit);
  };

  // --- Dropdown options (assuming these are defined as before) ---
  const taskStatusOptions = [ { value: 'Done', label: 'Done' }, { value: 'Future Work', label: 'Future Work' }, { value: 'Leave', label: 'Leave' }, { value: 'Ongoing', label: 'Ongoing' }, { value: 'Paused', label: 'Paused' }];
  const taskTypeOptions = [ { value: 'Admin', label: 'Admin' }, { value: 'Community', label: 'Community' }, { value: 'Learning', label: 'Learning' }, { value: 'Managed Services', label: 'Managed Services' }, { value: 'Mentoring', label: 'Mentoring' }, { value: 'Others', label: 'Others' }, { value: 'Pre-sales', label: 'Pre-sales' }, { value: 'Program', label: 'Program' }, { value: 'Project', label: 'Project' }];
  const billableOptions = [ { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }];
  const resourceOptions = [ { value: '1', label: 'John Doe' }, { value: '2', label: 'Jane Smith' }];
  // --- End Dropdown options ---

  return (
    // Modal Overlay
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-30 z-50 overflow-y-auto p-8">
      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 text-2xl font-bold hover:text-primary-dark"
          aria-label="Close modal"
        >
          ×
        </button>
        {/* Title */}
        <h2 className="text-primary text-h2 font-sans mb-6">{title}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* --- Form Fields (same as before, ensure they have name prop) --- */}
          <Input label="Task Name" name="taskName" value={formData.taskName} onChange={handleChange} required />
          <Select label="Resource" name="resourceId" options={resourceOptions} value={formData.resourceId} onChange={handleChange} required />
          <Select label="Task Type" name="taskType" options={taskTypeOptions} value={formData.taskType} onChange={handleChange} required />
          <Select label="Status" name="taskStatus" options={taskStatusOptions} value={formData.taskStatus} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            <Input label="End Date" type="date" name="endDate" value={formData.endDate} onChange={handleChange} required min={formData.startDate} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Billable" name="billable" options={billableOptions} value={formData.billable} onChange={handleChange} required />
            <Input label="Task Allocation (Hr/s)" type="number" name="taskAllocationHours" value={formData.taskAllocationHours} onChange={handleChange} required step="0.01" min="0" max="24" />
          </div>
          {/* --- End Form Fields --- */}

          {/* Button and ErrorMessage */}
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
