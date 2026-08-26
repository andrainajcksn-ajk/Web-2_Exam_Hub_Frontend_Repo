// myApi.js
import { apiClient } from './client.js'

export function getMyExams() {
  return apiClient.get('/my/exams')
}

export function getMyExam(id) {
  return apiClient.get(`/my/exams/${id}`)
}

export function submitMyExam(id, answers) {
  return apiClient.post(`/my/exams/${id}/submit`, { answers })
}

export function getMyResults() {
  return apiClient.get('/my/results')
}