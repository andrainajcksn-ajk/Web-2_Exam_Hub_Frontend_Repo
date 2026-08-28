import { request } from './client';

export const listStudents = () => request('/students');
export const createStudent = (data) => request('/students', { method: 'POST', body: data });
export const updateStudent = (id, data) => request(`/students/${id}`, { method: 'PUT', body: data });
export const deactivateStudent = (id) => request(`/students/${id}`, { method: 'DELETE' });
