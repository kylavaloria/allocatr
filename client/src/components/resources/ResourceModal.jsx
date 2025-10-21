import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

// 1. Added resourceData prop
const ResourceModal = ({ type = 'add', resourceData = null, onClose, onSubmit }) => {
  const title = type === 'edit' ? 'Edit Resource' : 'Add Resource';

  // 2. Set default values based on resourceData or empty object
  const data = resourceData || {};

  return (
    // This aligns the modal to the top, respecting the padding.
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-30 z-50 overflow-y-auto p-8">

      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">

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
          <Input label="Name" defaultValue={data.name} />
          <Input label="Unit" defaultValue={data.unit} />
          <Input label="Role" defaultValue={data.role} />
          <Input label="Generalization" defaultValue={data.generalization} />
          <Input label="Specialization" defaultValue={data.specialization} />

          {/* Two-column row */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Capacity per Week (Hrs)" defaultValue={data.capacity} />
            <Input label="Rate Card" defaultValue={data.rateCard} />
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

export default ResourceModal;
