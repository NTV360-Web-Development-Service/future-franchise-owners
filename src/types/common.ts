// Common utility types for future use
export type Status = 'pending' | 'loading' | 'success' | 'error'

// API response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
}