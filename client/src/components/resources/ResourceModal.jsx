import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

// 1. Added taskData prop
const TaskModal = ({ type = 'add', taskData = null, onClose, onSubmit }) => {
  const title = type === 'edit' ? 'Edit Task' : 'Assign Task';

  // 2. Set default values based on taskData
  const data = taskData || {};

  return (
    // Modal Overlay (with scrolling and top-alignment)
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-30 z-50 overflow-y-auto p-8">

      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative font-sans">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 text-2xl font-bold hover:text-primary-dark"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-primary text-h2 font-sans mb-6">{title}</h2>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* 3. Pass defaultValues to each input */}
          <Input label="Task Name" defaultValue={data.name} />
          <Input label="Resource" defaultValue={data.resource} />
          <Input label="Task Type" defaultValue={data.type} />

          {/* Two-column row for dates */}
          <div className="grid grid-cols-2 gap-4">
            {/* Note: Your data.schedule needs to be parsed for this to work */}
            <Input label="Start Date" type="date" defaultValue={data.startDate} />
            <Input label="End Date" type="date" defaultValue={data.endDate} />
          </div>

          {/* Two-column row for allocation */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Task Billable" defaultValue={data.isBillable ? 'Yes' : 'No'} />
            <Input label="Task Allocation (Hr/s)" defaultValue={data.workDays} />
          </div>

          {/* Done Button */}
          <div className="mt-6">
            <Button label="Done" onClick={onSubmit} className="w-full" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
