import express from 'express';
import {
  getAllTasks,
  getTaskById,
  getTasksByResource,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks
} from '../controllers/taskController.js';

const router = express.Router();

// GET /api/tasks - Get all tasks
router.get('/', getAllTasks);

// GET /api/tasks/:id - Get single task by ID
router.get('/:id', getTaskById);

// GET /api/tasks/resource/:resourceId - Get all tasks for a specific resource
router.get('/resource/:resourceId', getTasksByResource);

// POST /api/tasks - Create new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', updateTask);

// PATCH /api/tasks/bulk - Bulk update tasks (e.g., change visibility)
router.patch('/bulk', bulkUpdateTasks);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask);

export default router;
