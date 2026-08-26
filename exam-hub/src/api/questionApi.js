import { apiClient } from './client.js'

export function getExamQuestions(examId) {
  return apiClient.get(`/exams/${examId}/questions`)
}

export function createQuestion(examId, { statement, points, choices }) {
  return apiClient.post(`/exams/${examId}/questions`, { statement, points, choices })
}

export function updateQuestion(questionId, data) {
  return apiClient.put(`/questions/${questionId}`, data)
}

export function deleteQuestion(questionId) {
  return apiClient.del(`/questions/${questionId}`)
}