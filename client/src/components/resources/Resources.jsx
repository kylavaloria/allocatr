import React, { useState } from 'react';
import SearchInput from '../filters/SearchInput';
import ResourceTable from './ResourceTable';
import TaskModal from '../tasks/TaskModal';
import ResourceModal from './ResourceModal';

const Resources = () => {
  // --- State for Modals ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  // "Edit" modal state is no longer needed here

  // --- Task Modal Handlers ---
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
  };
  const handleSubmitTask = () => {
    console.log('Task submitted!');
    setIsTaskModalOpen(false);
  };

  // --- "Add Resource" Modal Handlers ---
  const handleCloseResourceModal = () => {
    setIsResourceModalOpen(false);
  };
  const handleSubmitAddResource = () => {
    console.log('Resource ADDED!');
    handleCloseResourceModal();
  };
  // "Edit" and "Delete" handlers are no longer needed here

  return (
    <>
      <div className="w-full p-6 font-sans rounded-2xl border border-gray-200">
        {/* Title */}
        <h2 className="text-primary-dark text-h3 font-medium mb-6">
          Resources
        </h2>

        {/* Controls: Search + Buttons */}
        <div className="flex justify-between items-center mb-6">
          {/* Search Bar (Left) */}
          <div className="w-full max-w-md ">
            <SearchInput placeholder="Search" />
          </div>

          {/* Buttons (Right) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* "Assign Task" Button (Gray) */}
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center justify-center gap-2 text-body-md font-normal font-sans rounded-xl px-6 py-2 text-center transition-all duration-200
                               border border-gray-300 text-gray-300 bg-white
                               hover:bg-gray-300 hover:text-gray-50
                               focus:outline-none focus:bg-gray-300 focus:text-gray-50"
            >
              <span>Assign Task</span>
              <span className="text-xl font-light">+</span>
            </button>

            {/* "Add Resource" Button (Blue) */}
            <button
              onClick={() => setIsResourceModalOpen(true)}
              className="flex items-center justify-center gap-2 text-body-md font-normal font-sans rounded-xl px-6 py-2 text-center transition-all duration-200
                               border border-gray-300 text-gray-300 bg-white
                               hover:bg-gray-300 hover:text-gray-50
                               focus:outline-none focus:bg-gray-300 focus:text-gray-50"
            >
              <span>Add Resource</span>
              <span className="text-xl font-light">+</span>
            </button>
          </div>
        </div>

        {/* Resource Table no longer needs any props for edit/delete,
          as ResourceRow now handles this internally.
        */}
        <ResourceTable />
      </div>

      {/* --- Conditionally render modals --- */}

      {/* Task Modal (for "Assign Task") */}
      {isTaskModalOpen && (
        <TaskModal
          type="add"
          onClose={handleCloseTaskModal}
          onSubmit={handleSubmitTask}
        />
      )}

      {/* Resource Modal (for "Add Resource") */}
      {isResourceModalOpen && (
        <ResourceModal
          type="add"
          onClose={handleCloseResourceModal}
          onSubmit={handleSubmitAddResource}
        />
      )}
    </>
  );
};

export default Resources;
