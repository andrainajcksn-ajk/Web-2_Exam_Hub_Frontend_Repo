import { apiClient } from './client.js'

export function login(email, password) {
  return apiClient.post('/auth/login', { email, password })
}