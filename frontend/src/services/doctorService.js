import api from './api';

export const getDoctorsAPI = (params) => api.get('/doctors', { params });
export const getDoctorByIdAPI = (id) => api.get(`/doctors/${id}`);
export const getSpecializationsAPI = () => api.get('/doctors/specializations');
export const getDoctorProfileAPI = () => api.get('/doctors/profile/me');
export const updateDoctorProfileAPI = (data) => api.put('/doctors/profile/me', data);
export const updateDoctorImageAPI = (formData) => api.put('/doctors/profile/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
