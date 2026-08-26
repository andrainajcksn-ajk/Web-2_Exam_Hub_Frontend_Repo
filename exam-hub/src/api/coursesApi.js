import { apiClient } from './client.js'

export function getCourses() {
  return apiClient.get('/courses')
}

export function createCourse({ code, name, description }) {
  return apiClient.post('/courses', { code, name, description })
}

export function updateCourse(id, data) {
  return apiClient.put(`/courses/${id}`, data)
}

export function deleteCourse(id) {
  return apiClient.del(`/courses/${id}`)
}