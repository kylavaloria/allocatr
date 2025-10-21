import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const TaskModal = ({ type = 'add', onClose, onSubmit }) => {
  const title = type === 'edit' ? 'Edit Task' : 'Assign Task';

  return (
    // Modal Overlay
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">

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
          <Input label="Task Name" />
          <Input label="Resource" />
          <Input label="Task Type" />

          {/* Two-column row for dates */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" /> {/* <-- CHANGED */}
            <Input label="End Date" type="date" /> {/* <-- CHANGED */}
          </div>

          {/* Two-column row for allocation */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Task Billable" />
            <Input label="Task Allocation (Hr/s)" />
          </div>

          {/* Done Button */}
          <div className="mt-6">
            <Button label="Done" onClick={onSubmit} className="w-full" /> {/* <-- CHANGED */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
