import { apiClient } from './client.js'

export function getExamResults(examId) {
  return apiClient.get(`/exams/${examId}/results`)
}