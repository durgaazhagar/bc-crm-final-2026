import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bloodconnect_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Donor service wrapper
export const donorService = {
  getAll: (): Promise<any> => api.get('/donors'),
  getDonors: (): Promise<any> => api.get('/donors'),
  createDonor: (data: any): Promise<any> => api.post('/donors', data),
  updateDonor: (id: any, data: any): Promise<any> => api.put(`/donors/${id}`, data),
  deleteDonor: (id: any): Promise<any> => api.delete(`/donors/${id}`),
};

// Simple AI service wrapper
export const aiService = {
  getDonorActivity: (): Promise<any> => api.get('/ai/donor-activity'),
  getSystemHealth: (): Promise<any> => api.get('/ai/system-health'),
  getEmergencyReadiness: (): Promise<any> => api.get('/ai/emergency-readiness'),
  findNearestDonor: (body: any): Promise<any> => api.post('/ai/nearest-donor', body),
  checkEligibility: (body: any): Promise<any> => api.post('/ai/check-eligibility', body),
  classifyEmergencyPriority: (body: any): Promise<any> => api.post('/ai/emergency-priority', body),
  matchDonors: (body: any): Promise<any> => api.post('/ai/match-donors', body),
  predictShortage: (body: any): Promise<any> => api.post('/ai/predict-shortage', body),
};

export const authService = {
  requestPasswordReset: (payload: any): Promise<any> => api.post('/auth/forgot-password', payload),
  resetPassword: (payload: any): Promise<any> => api.post('/auth/reset-password', payload),
  register: (payload: any): Promise<any> => api.post('/auth/register', payload),
};

export const dispatchService = {
  list: (params = {}) => api.get('/dispatch', { params }),
  get: (id: string) => api.get(`/dispatch/${id}`),
  create: (body: any) => api.post('/dispatch', body),
  assign: (id: string, body: any) => api.put(`/dispatch/${id}/assign`, body),
  notify: (id: string) => api.post(`/dispatch/${id}/notify`),
};

export default api;
