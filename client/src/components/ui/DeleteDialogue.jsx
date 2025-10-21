import React from 'react';
import Button from './Button';

/**
 * A confirmation modal for delete actions.
 * @param {object} props
 * @param {'Resource' | 'Task' | string} props.type - The type of item being deleted (e.g., "Resource").
 * @param {() => void} props.onClose - Function to call when closing the modal (e.g., "Cancel").
 * @param {() => void} props.onConfirm - Function to call when confirming the deletion (e.g., "Yes").
 */
const DeleteDialogue = ({ type = 'Item', onClose, onConfirm }) => {
  return (
    // Modal Overlay
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">

      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 font-sans">

        {/* Title */}
        <h2 className="text-primary text-h1 font-medium mb-4">
          Delete {type}
        </h2>

        {/* Body Text */}
        <p className="text-gray-300 text-h3 font-normal mb-8">
          Are you sure to delete this {type.toLowerCase()}?
        </p>

        {/* Button Container */}
        <div className="flex justify-end items-center gap-4">

          {/* Cancel Button (uses the default Button.jsx) */}
          <Button label="Cancel" onClick={onClose} />

          {/* Yes Button (styled as requested) */}
          <button
            onClick={onConfirm}
            className="border border-primary text-primary text-body-md font-normal font-sans rounded-xl
                       px-8 py-3 bg-white text-center transition-all duration-200
                       hover:bg-primary hover:text-gray-50
                       focus:outline-none focus:bg-primary focus:text-gray-50"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialogue;
