import { request } from './client';

export const updateQuestion = (id, data) => request(`/questions/${id}`, { method: 'PUT', body: data });
export const deleteQuestion = (id) => request(`/questions/${id}`, { method: 'DELETE' });
