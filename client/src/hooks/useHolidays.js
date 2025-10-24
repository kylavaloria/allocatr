import { useState, useEffect } from 'react';
import { holidaysAPI } from '../services/api';

export const useHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all holidays
  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await holidaysAPI.getAll();
      setHolidays(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch holidays');
      console.error('Error fetching holidays:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch holidays by date range
  const fetchHolidaysByRange = async (start, end) => {
    setLoading(true);
    setError(null);
    try {
      const response = await holidaysAPI.getByRange(start, end);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch holidays');
      console.error('Error fetching holidays by range:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create new holiday
  const createHoliday = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await holidaysAPI.create(data);
      await fetchHolidays(); // Refresh list
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create holiday';
      setError(message);
      console.error('Error creating holiday:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update holiday
  const updateHoliday = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await holidaysAPI.update(id, data);
      await fetchHolidays(); // Refresh list
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update holiday';
      setError(message);
      console.error('Error updating holiday:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Delete holiday
  const deleteHoliday = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await holidaysAPI.delete(id);
      await fetchHolidays(); // Refresh list
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete holiday';
      setError(message);
      console.error('Error deleting holiday:', err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch holidays on mount
  useEffect(() => {
    fetchHolidays();
  }, []);

  return {
    holidays,
    loading,
    error,
    fetchHolidays,
    fetchHolidaysByRange,
    createHoliday,
    updateHoliday,
    deleteHoliday
  };
};
