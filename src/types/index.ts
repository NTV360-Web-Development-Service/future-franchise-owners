/**
 * @fileoverview Central type definitions export module
 * 
 * This module serves as the main entry point for all TypeScript type definitions
 * used throughout the franchise website application. It re-exports types from
 * various modules to provide a centralized import location.
 * 
 * @module Types
 */

/**
 * Re-export all Payload CMS related types
 * Includes configuration, user management, media handling, and database types
 */
export type {
  Config,
  SupportedTimezones,
  UserAuthOperations,
  User,
  Media,
  Page,
  PayloadLockedDocument,
  PayloadPreference,
  PayloadMigration,
  UsersSelect,
  MediaSelect,
  PagesSelect,
  PayloadLockedDocumentsSelect,
  PayloadPreferencesSelect,
  PayloadMigrationsSelect,
  Auth,
} from './payload'

/**
 * Re-export UI component related types
 * Includes props interfaces for various UI components
 */
export type { HeroBlockProps } from './ui'

/**
 * Re-export common utility types
 * Includes status enums and API response interfaces
 */
export type { Status, ApiResponse } from './common'
