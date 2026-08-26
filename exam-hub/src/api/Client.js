const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const TOKEN_KEY = 'exam_hub_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

let onUnauthorized = null
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    if (res.status === 401 && onUnauthorized) onUnauthorized()
    const message = data?.message || `Erreur ${res.status}`
    const error = new Error(message)
    error.status = res.status
    throw error
  }

  return data
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
}