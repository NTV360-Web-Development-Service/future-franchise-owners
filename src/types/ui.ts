/**
 * @fileoverview UI component type definitions
 * 
 * This module contains type definitions specifically for UI components
 * used throughout the franchise website application. These types define
 * the structure of props and data for various UI elements.
 * 
 * @module Types/UI
 */

/**
 * Props interface for the HeroBlock component
 * 
 * Defines the structure of data required for rendering hero sections
 * throughout the application. Hero blocks typically appear at the top
 * of pages and contain prominent messaging and call-to-action elements.
 * 
 * @interface HeroBlockProps
 * @property {string} heading - Main heading text displayed prominently
 * @property {any} subheading - Rich text content from Payload CMS (supports formatting)
 * @property {any} image - Media object from Payload CMS containing image data
 * @property {Object} cta_button - Call-to-action button configuration
 * @property {string} cta_button.label - Text displayed on the CTA button
 * @property {string} cta_button.url - URL the button links to when clicked
 */
export interface HeroBlockProps {
  /** Main heading text displayed prominently */
  heading: string
  /** Rich text content from Payload CMS (supports formatting) */
  subheading: any // Rich text from Payload
  /** Media object from Payload CMS containing image data */
  image: any // Media from Payload
  /** Call-to-action button configuration */
  cta_button: {
    /** Text displayed on the CTA button */
    label: string
    /** URL the button links to when clicked */
    url: string
  }
}