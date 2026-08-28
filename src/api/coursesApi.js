import { request } from './client';

export const listCourses = () => request('/courses');
export const createCourse = (data) => request('/courses', { method: 'POST', body: data });
export const updateCourse = (id, data) => request(`/courses/${id}`, { method: 'PUT', body: data });
export const deleteCourse = (id) => request(`/courses/${id}`, { method: 'DELETE' });
