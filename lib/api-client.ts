import { API_BASE_URL } from './api-config'

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `Failed to connect to API server. Make sure the Express server is running on ${API_BASE_URL}` 
      }))
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error: any) {
    // Network errors (server not running, CORS, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        `Cannot connect to API server at ${API_BASE_URL}. ` +
        `Please make sure the Express server is running on port 3001. ` +
        `Error: ${error.message}`
      )
    }
    throw error
  }
}

// API client methods
export const api = {
  // Categories
  getCategories: () => apiRequest<{ categories: any[] }>('/api/categories'),
  createCategory: (data: any) =>
    apiRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: any) =>
    apiRequest(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    apiRequest(`/api/categories/${id}`, {
      method: 'DELETE',
    }),

  // Expenses
  getExpenses: (params: Record<string, string>) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest<{
      expenses: any[]
      total: number
      page: number
      totalPages: number
    }>(`/api/expenses?${queryString}`)
  },
  createExpense: (data: any) =>
    apiRequest('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateExpense: (id: string, data: any) =>
    apiRequest(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteExpense: (id: string) =>
    apiRequest(`/api/expenses/${id}`, {
      method: 'DELETE',
    }),

  // Analytics
  getAnalytics: (params: Record<string, string>) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/analytics/summary?${queryString}`)
  },
}

