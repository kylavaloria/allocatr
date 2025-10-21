import React from 'react';
import TaskHeader from './TaskHeader';
import TaskRow from './TaskRow';

const TaskDrawer = () => {
  // Mock data based on your screenshot
  const tasks = [
    {
      id: 1,
      name: 'Data & AI Weekly Cadence - Bi-Weekly with Boss Lahiru',
      type: 'Future Work',
      schedule: 'Oct 4 2025 - Oct 18 2025',
      workDays: 5,
      allocation: 60,
      progress: 70,
      isBillable: true,
      status: 'ongoing',
    },
    {
      id: 2,
      name: 'Data & AI Weekly Cadence - Bi-Weekly with Boss Lahiru',
      type: 'Future Work',
      schedule: 'Oct 4 2025 - Oct 18 2025',
      workDays: 5,
      allocation: 60,
      progress: 70,
      isBillable: false,
      status: 'ongoing',
    },
  ];

  return (
    // --- CHANGED: Removed "overflow-x-auto" ---
    <div className="w-full">
      <table className="w-full border-collapse min-w-[1024px]">
        <TaskHeader />
        <tbody>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskDrawer;
