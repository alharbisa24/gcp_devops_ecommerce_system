const API_BASE = import.meta.env.VITE_API_BASE || ''

async function request(path, { method = 'GET', body, headers } = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  }

  if (body !== undefined) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE}${path}`, options)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Request failed')
  }

  return data
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, body, method: 'POST' }),
  put: (path, body, options) => request(path, { ...options, body, method: 'PUT' }),
  patch: (path, body, options) => request(path, { ...options, body, method: 'PATCH' }),
}
