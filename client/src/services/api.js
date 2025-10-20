import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const resourcesAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/resources`),
  getById: (id) => axios.get(`${API_BASE_URL}/resources/${id}`),
  getDetails: (id) => axios.get(`${API_BASE_URL}/resources/${id}/details`),
  create: (data) => axios.post(`${API_BASE_URL}/resources`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/resources/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/resources/${id}`)
};

export const tasksAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/tasks`),
  getByResource: (resourceId) => axios.get(`${API_BASE_URL}/tasks/resource/${resourceId}`),
  create: (data) => axios.post(`${API_BASE_URL}/tasks`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/tasks/${id}`, data),
  bulkUpdate: (taskIds, updates) => axios.patch(`${API_BASE_URL}/tasks/bulk`, { taskIds, updates }),
  delete: (id) => axios.delete(`${API_BASE_URL}/tasks/${id}`)
};

export const holidaysAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/holidays`),
  getByRange: (start, end) => axios.get(`${API_BASE_URL}/holidays/range?start=${start}&end=${end}`),
  create: (data) => axios.post(`${API_BASE_URL}/holidays`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/holidays/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/holidays/${id}`)
};
