import React from 'react';

/**
 * A dropdown menu for "Edit" and "Delete" actions.
 * @param {object} props
 * @param {() => void} props.onEdit - Function to call when "Edit" is clicked.
 * @param {() => void} props.onDelete - Function to call when "Delete" is clicked.
 */
const Action = ({ onEdit, onDelete }) => {
  return (
    // --- CHANGED: z-10 to z-50 ---
    <div className="absolute right-0 w-24 bg-white border border-gray-200 rounded-lg font-sans z-50">
      <ul className="text-gray-300 text-body-xs font-normal">
        {/* Edit Button */}
        <li>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-left hover:text-primary-dark hover:underline transition-colors"
          >
            {/* Edit Icon (Pencil) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Edit</span>
          </button>
        </li>

        {/* Delete Button */}
        <li>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-left hover:text-primary-dark hover:underline transition-colors"
          >
            {/* Delete Icon (Trash) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                clipRule="evenodd"
              />
            </svg>
            <span>Delete</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Action;
