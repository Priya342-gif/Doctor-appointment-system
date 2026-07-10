import api from './api';

export const registerAPI = (data) => api.post('/auth/register', data);
export const loginAPI = (data) => api.post('/auth/login', data);
export const getMeAPI = () => api.get('/auth/me');
export const updatePasswordAPI = (data) => api.put('/auth/update-password', data);
