import api from './api';

export const getPatientProfileAPI = () => api.get('/patients/profile/me');
export const updatePatientProfile = (data) => api.put('/patients/profile/me', data);
export const updatePatientImage = (formData) => api.put('/patients/profile/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
