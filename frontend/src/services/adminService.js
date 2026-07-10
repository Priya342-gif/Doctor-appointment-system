import api from './api';

export const getDashboardStatsAPI = () => api.get('/admin/stats');
export const getAdminDoctorsAPI = (params) => api.get('/admin/doctors', { params });
export const addDoctorAPI = (formData) => api.post('/admin/doctors', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const editDoctorAPI = (id, formData) => api.put(`/admin/doctors/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteDoctorAPI = (id) => api.delete(`/admin/doctors/${id}`);
export const getPatientsAPI = (params) => api.get('/patients', { params });
export const deleteUserAPI = (id) => api.delete(`/admin/users/${id}`);
export const toggleUserStatusAPI = (id) => api.put(`/admin/users/${id}/toggle`);
