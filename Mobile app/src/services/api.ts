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
  
  getMetrics: (period: 'week' | 'month' | 'year' = 'month') =>
    api.get(`/reports/metrics/?period=${period}`),
  
  exportTransactionsCSV: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return api.get(`/reports/export/transactions/csv/?${params}`, { responseType: 'blob' });
  },
  
  exportBudgetCSV: () =>
    api.get('/reports/export/budget/csv/', { responseType: 'blob' }),
  
  exportReportPDF: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return api.get(`/reports/export/report/pdf/?${params}`, { responseType: 'blob' });
  },
  
  exportBalanceSheetExcel: () =>
    api.get('/reports/export/balance-sheet/excel/', { responseType: 'blob' }),
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
  getMetrics: () =>
    api.get('/accounting/dashboard/'),
  
  getCreditLimit: () =>
    api.get('/accounting/credit-limit/'),
  
  applyCredit: () =>
    api.post('/accounting/apply-credit/'),
  
  calculateTax: (year: string) =>
    api.get(`/accounting/tax-calculator/?year=${year}`),
};

export const summaryAPI = {
  getIncome: () =>
    api.get('/accounting/summary/?period=month'),
};

export const debtorAPI = {
  getAll: () =>
    api.get('/accounting/debtors/'),
  
  create: (data: any) =>
    api.post('/accounting/debtors/', data),
  
  getTotalOwed: () =>
    api.get('/accounting/debtors/total/'),
  
  settleDebt: (debtorId: number) =>
    api.post(`/accounting/debtors/${debtorId}/settle/`),
};

export default api;
