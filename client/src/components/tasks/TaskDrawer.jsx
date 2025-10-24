import React, { useEffect, useState } from 'react';
import TaskHeader from './TaskHeader';
import TaskRow from './TaskRow';
import { useTasks } from '../../hooks/useTasks';

const TaskDrawer = ({ resourceId, onRefresh, availableResources = [] }) => {
  const [tasks, setTasks] = useState([]);
  const { fetchTasksByResource, loading, error } = useTasks();

  useEffect(() => {
    loadTasks();
  }, [resourceId]);

  const loadTasks = async () => {
    const fetchedTasks = await fetchTasksByResource(resourceId);
    setTasks(fetchedTasks);
  };

  const handleTaskUpdate = async () => {
    await loadTasks();
    if (onRefresh) {
      onRefresh(); // Refresh parent resource data
    }
  };

  if (loading) {
    return (
      <div className="w-full p-8 text-center text-gray-300">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center text-red-500">
        Error loading tasks: {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-300">
        No tasks assigned to this resource yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full border-collapse min-w-[1024px]">
        <TaskHeader />
        <tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task.TaskID}
              task={task}
              onUpdate={handleTaskUpdate}
              availableResources={availableResources}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskDrawer;
