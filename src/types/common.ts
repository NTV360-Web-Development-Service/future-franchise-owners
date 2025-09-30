/**
 * @fileoverview Common utility types and interfaces
 * 
 * This module contains reusable type definitions that are used across
 * multiple components and modules in the franchise website application.
 * 
 * @module Types/Common
 */

/**
 * Status type for tracking operation states
 * 
 * Used throughout the application to represent the current state of
 * asynchronous operations, data loading, and user interactions.
 * 
 * @typedef {'pending' | 'loading' | 'success' | 'error'} Status
 */
export type Status = 'pending' | 'loading' | 'success' | 'error'

/**
 * Generic API response interface
 * 
 * Standardized structure for all API responses throughout the application.
 * Provides consistent error handling and data structure for client-server communication.
 * 
 * @template T - The type of data returned in successful responses
 * 
 * @interface ApiResponse
 * @property {T} [data] - The response data (present on successful requests)
 * @property {string} [error] - Error message (present on failed requests)
 * @property {string} [message] - Additional message or description
 * @property {number} status - HTTP status code of the response
 */
export interface ApiResponse<T = any> {
  /** The response data (present on successful requests) */
  data?: T
  /** Error message (present on failed requests) */
  error?: string
  /** Additional message or description */
  message?: string
  /** HTTP status code of the response */
  status: number
}