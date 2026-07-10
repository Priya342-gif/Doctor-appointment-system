import api from './api';

export const bookAppointmentAPI = (data) => api.post('/appointments', data);
export const getPatientAppointmentsAPI = (params) => api.get('/appointments/patient', { params });
export const getDoctorAppointmentsAPI = (params) => api.get('/appointments/doctor', { params });
export const getTodayAppointmentsAPI = () => api.get('/appointments/doctor/today');
export const getAllAppointmentsAPI = (params) => api.get('/appointments', { params });
export const updateAppointmentStatusAPI = (id, data) => api.put(`/appointments/${id}`, data);
export const cancelAppointmentAPI = (id) => api.delete(`/appointments/${id}`);
