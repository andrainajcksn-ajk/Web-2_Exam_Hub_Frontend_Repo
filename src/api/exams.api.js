import { request } from './client';

export const listExams = () => request('/exams');
export const getExam = (id) => request(`/exams/${id}`);
export const createExam = (data) => request('/exams', { method: 'POST', body: data });
export const updateExam = (id, data) => request(`/exams/${id}`, { method: 'PUT', body: data });
export const deleteExam = (id) => request(`/exams/${id}`, { method: 'DELETE' });
export const getExamResults = (id) => request(`/exams/${id}/results`);
export const getExamQuestions = (id) => request(`/exams/${id}/questions`);
export const addQuestion = (id, data) => request(`/exams/${id}/questions`, { method: 'POST', body: data });
