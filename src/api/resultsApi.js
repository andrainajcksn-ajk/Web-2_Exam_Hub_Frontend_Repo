import { request } from './client';

export const myExams = () => request('/my/exams');
export const myExamDetail = (id) => request(`/my/exams/${id}`);
export const submitExam = (id, answers) => request(`/my/exams/${id}/submit`, { method: 'POST', body: { answers } });
export const myResults = () => request('/my/results');
