import { apiClient } from './client.js'

export function getStudents() {
  return apiClient.get('/students')
}

export function createStudent({ name, email, password }) {
  return apiClient.post('/students', { name, email, password })
}

export function updateStudent(id, data) {
  return apiClient.put(`/students/${id}`, data)
}

export function deactivateStudent(id) {
  return apiClient.del(`/students/${id}`)
}