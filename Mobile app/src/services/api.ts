import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  console.log('Token:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, 'Status:', response.status);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, 'Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    if (error.response?.status === 401) {
      console.error('Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (phone: string, password: string) =>
    api.post('/users/login/', { phone, password }),
  
  register: (data: any) =>
    api.post('/users/register/', data),
  
  logout: () =>
    api.post('/users/logout/'),
};

export const transactionAPI = {
  getAll: () =>
    api.get('/accounting/transactions/'),
  
  create: (data: any) =>
    api.post('/accounting/transactions/', data),
  
  update: (id: string, data: any) =>
    api.put(`/accounting/transactions/${id}/`, data),
  
  delete: (id: string) =>
    api.delete(`/accounting/transactions/${id}/`),
};

export const budgetAPI = {
  getCategories: () =>
    api.get('/budget/categories/'),
  
  createCategory: (data: any) =>
    api.post('/budget/categories/', data),
  
  updateCategory: (id: string, data: any) =>
    api.put(`/budget/categories/${id}/`, data),
};

export const goalAPI = {
  getAll: () =>
    api.get('/budget/goals/'),
  
  create: (data: any) =>
    api.post('/budget/goals/', data),
  
  update: (id: string, data: any) =>
    api.put(`/budget/goals/${id}/`, data),
  
  contribute: (id: string, amount: number) =>
    api.post(`/budget/goals/${id}/contribute/`, { amount }),
};

export const reportAPI = {
  getDashboard: () =>
    api.get('/reports/dashboard/'),
  
  getMonthly: (month: string, year: string) =>
    api.get(`/reports/monthly/?month=${month}&year=${year}`),
  
  getProfitLoss: (startDate: string, endDate: string) =>
    api.get(`/reports/profit-loss/?start_date=${startDate}&end_date=${endDate}`),
};

export const aiAPI = {
  chat: (message: string) =>
    api.post('/ai/chat/', { message }),
  
  getInsights: () =>
    api.get('/ai/insights/'),
  
  getRecommendations: () =>
    api.get('/ai/recommendations/'),
  
  getConversationHistory: () =>
    api.get('/ai/conversations/'),
  
  getBusinessAdvice: () =>
    api.post('/ai/business-advisor/'),
};

export const businessAPI = {
  getCreditLimit: () =>
    api.get('/accounting/credit-limit/'),
  
  applyCredit: () =>
    api.post('/accounting/apply-credit/'),
  
  calculateTax: (year: string) =>
    api.get(`/accounting/tax-calculator/?year=${year}`),
};

export default api;
