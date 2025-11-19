/**
 * API Service
 * Wrapper around fetch for API calls
 * In production, replace '/api' with actual backend URL
 */

const API_BASE = '/api';

// Get auth token
const getAuthToken = () => localStorage.getItem('authToken');

// Make API request
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  logout: () => apiRequest('/logout', { method: 'POST' }),
};

// Pages API
export const pagesAPI = {
  getAll: () => apiRequest('/pages'),
  
  getById: (id) => apiRequest(`/pages/${id}`),
  
  create: (data) => 
    apiRequest('/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id, data) => 
    apiRequest(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id) => 
    apiRequest(`/pages/${id}`, {
      method: 'DELETE',
    }),
};

// Sections API
export const sectionsAPI = {
  getAll: (pageId) => {
    const query = pageId ? `?pageId=${pageId}` : '';
    return apiRequest(`/sections${query}`);
  },
  
  getById: (id) => apiRequest(`/sections/${id}`),
  
  create: (data) => 
    apiRequest('/sections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id, data) => 
    apiRequest(`/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id) => 
    apiRequest(`/sections/${id}`, {
      method: 'DELETE',
    }),
  
  reorder: (sections) => 
    apiRequest('/sections/reorder', {
      method: 'POST',
      body: JSON.stringify({ sections }),
    }),
};

// Surveys API
export const surveysAPI = {
  getAll: () => apiRequest('/surveys'),
  
  getById: (id) => apiRequest(`/surveys/${id}`),
  
  create: (data) => 
    apiRequest('/surveys', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id, data) => 
    apiRequest(`/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id) => 
    apiRequest(`/surveys/${id}`, {
      method: 'DELETE',
    }),
  
  getResponses: (id) => apiRequest(`/surveys/${id}/responses`),
  
  submitResponse: (id, data) => 
    apiRequest(`/surveys/${id}/responses`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Data export/import API
export const dataAPI = {
  export: () => apiRequest('/export'),
  
  import: (data) => 
    apiRequest('/import', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

