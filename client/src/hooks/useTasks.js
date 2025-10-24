import { useState } from 'react';
import { tasksAPI } from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksAPI.getAll();
      setTasks(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks by resource
  const fetchTasksByResource = async (resourceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksAPI.getByResource(resourceId);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksAPI.create(data);
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      setError(message);
      console.error('Error creating task:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const updateTask = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksAPI.update(id, data);
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      setError(message);
      console.error('Error updating task:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Bulk update tasks
  const bulkUpdateTasks = async (taskIds, updates) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksAPI.bulkUpdate(taskIds, updates);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update tasks';
      setError(message);
      console.error('Error bulk updating tasks:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await tasksAPI.delete(id);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task';
      setError(message);
      console.error('Error deleting task:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    fetchTasksByResource,
    createTask,
    updateTask,
    bulkUpdateTasks,
    deleteTask
  };
};
