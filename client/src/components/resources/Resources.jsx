import React, { useState, useEffect } from 'react';
import SearchInput from '../filters/SearchInput';
import ResourceTable from './ResourceTable';
import TaskModal from '../tasks/TaskModal';
import ResourceModal from './ResourceModal';
import { useResources } from '../../hooks/useResources';
import { useTasks } from '../../hooks/useTasks';

const Resources = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    resources,
    loading: resourcesLoading,
    error: resourcesError,
    fetchResources,
    createResource: createResourceAPI,
    updateResource,
    deleteResource
  } = useResources();

  const {
    createTask,
    loading: tasksLoading
  } = useTasks();

  // Fetch resources on mount
  useEffect(() => {
    fetchResources();
  }, []);

  // Task Modal Handlers
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const handleSubmitTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      console.log('Task created successfully:', result.data);
      setIsTaskModalOpen(false);
      // Refresh resources to update calculations
      fetchResources();
    } else {
      console.error('Failed to create task:', result.error);
      alert(`Error: ${result.error}`);
    }
  };

  // Resource Modal Handlers
  const handleCloseResourceModal = () => {
    setIsResourceModalOpen(false);
  };

  const handleSubmitAddResource = async (resourceData) => {
    const result = await createResourceAPI(resourceData);
    if (result.success) {
      console.log('Resource created successfully:', result.data);
      handleCloseResourceModal();
    } else {
      console.error('Failed to create resource:', result.error);
      alert(`Error: ${result.error}`);
    }
  };

  // Filter resources based on search query
  const filteredResources = resources.filter(resource =>
    resource.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.Unit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.Role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="w-full max-w-md">
            <SearchInput
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Buttons (Right) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* "Assign Task" Button */}
            <button
              onClick={() => setIsTaskModalOpen(true)}
              disabled={tasksLoading}
              className="flex items-center justify-center gap-2 text-body-md font-normal font-sans rounded-xl px-6 py-2 text-center transition-all duration-200
                               border border-gray-300 text-gray-300 bg-white
                               hover:bg-gray-300 hover:text-gray-50
                               focus:outline-none focus:bg-gray-300 focus:text-gray-50
                               disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Assign Task</span>
              <span className="text-xl font-light">+</span>
            </button>

            {/* "Add Resource" Button */}
            <button
              onClick={() => setIsResourceModalOpen(true)}
              disabled={resourcesLoading}
              className="flex items-center justify-center gap-2 text-body-md font-normal font-sans rounded-xl px-6 py-2 text-center transition-all duration-200
                               border border-gray-300 text-gray-300 bg-white
                               hover:bg-gray-300 hover:text-gray-50
                               focus:outline-none focus:bg-gray-300 focus:text-gray-50
                               disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Add Resource</span>
              <span className="text-xl font-light">+</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {resourcesLoading && (
          <div className="text-center py-8 text-gray-300">
            Loading resources...
          </div>
        )}

        {/* Error State */}
        {resourcesError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {resourcesError}
          </div>
        )}

        {/* Resource Table */}
        {!resourcesLoading && !resourcesError && (
          <ResourceTable
            resources={filteredResources}
            onUpdate={updateResource}
            onDelete={deleteResource}
            onRefresh={fetchResources}
          />
        )}
      </div>

      {/* Task Modal - Pass available resources */}
      {isTaskModalOpen && (
        <TaskModal
          type="add"
          onClose={handleCloseTaskModal}
          onSubmit={handleSubmitTask}
          availableResources={resources} // Resources from API
        />
      )}

      {/* Resource Modal */}
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
