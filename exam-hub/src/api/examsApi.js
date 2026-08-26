import { apiClient } from './client.js'

export function getExams() {
  return apiClient.get('/exams')
}

export function getExam(id) {
  return apiClient.get(`/exams/${id}`)
}

export function createExam({ courseId, title, description, startsAt, endsAt }) {
  return apiClient.post('/exams', { courseId, title, description, startsAt, endsAt })
}

export function updateExam(id, data) {
  return apiClient.put(`/exams/${id}`, data)
}

export function deleteExam(id) {
  return apiClient.del(`/exams/${id}`)
}