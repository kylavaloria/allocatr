import { useState, useEffect } from 'react';
import { resourcesAPI } from '../services/api';

export const useResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all resources
  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await resourcesAPI.getAll();
      setResources(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resources');
      console.error('Error fetching resources:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single resource with details
  const fetchResourceDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await resourcesAPI.getDetails(id);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resource details');
      console.error('Error fetching resource details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new resource
  const createResource = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await resourcesAPI.create(data);
      await fetchResources(); // Refresh list
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create resource';
      setError(message);
      console.error('Error creating resource:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update resource
  const updateResource = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await resourcesAPI.update(id, data);
      await fetchResources(); // Refresh list
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update resource';
      setError(message);
      console.error('Error updating resource:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Delete resource
  const deleteResource = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await resourcesAPI.delete(id);
      await fetchResources(); // Refresh list
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete resource';
      setError(message);
      console.error('Error deleting resource:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    resources,
    loading,
    error,
    fetchResources,
    fetchResourceDetails,
    createResource,
    updateResource,
    deleteResource
  };
};
