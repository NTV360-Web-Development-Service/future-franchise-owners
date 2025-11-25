/**
 * @fileoverview Audit Logger Hooks
 *
 * Collection hooks that automatically track all changes across collections
 * and log them to the AuditLogs collection.
 *
 * @module Hooks/AuditLogger
 * @version 1.0.0
 */

import type { AfterChangeHook, AfterDeleteHook } from 'payload'

/**
 * Collections to exclude from audit logging
 * These collections don't need detailed change tracking
 */
const EXCLUDED_COLLECTIONS = [
  'auditLogs', // Don't log changes to audit logs themselves
  'payload-preferences', // Internal Payload collection
  'payload-migrations', // Internal Payload collection
]

/**
 * Fields to exclude from change tracking
 * These fields are automatically managed and don't need logging
 */
const EXCLUDED_FIELDS = ['updatedAt', 'createdAt', 'updatedBy', 'createdBy']

/**
 * Check if a value is a plain object (not array, date, etc)
 */
function isPlainObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
}

/**
 * Deep comparison to find changed nested fields
 */
function getNestedChanges(before: any, after: any, prefix = ''): { field: string; before: any; after: any }[] {
  const changed: { field: string; before: any; after: any }[] = []

  // Get all unique keys from both objects
  const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})])

  allKeys.forEach((key) => {
    const fullPath = prefix ? `${prefix}.${key}` : key
    const beforeValue = before?.[key]
    const afterValue = after?.[key]

    // If both are plain objects, recurse deeper
    if (isPlainObject(beforeValue) && isPlainObject(afterValue)) {
      const nestedChanges = getNestedChanges(beforeValue, afterValue, fullPath)
      changed.push(...nestedChanges)
    } 
    // Otherwise compare the values
    else if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      changed.push({
        field: fullPath,
        before: beforeValue,
        after: afterValue,
      })
    }
  })

  return changed
}

/**
 * Compare two objects and return the changed fields with their values
 */
function getChangedFields(before: any, after: any): { field: string; before: any; after: any }[] {
  const changed: { field: string; before: any; after: any }[] = []

  // Get all unique keys from both objects
  const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})])

  allKeys.forEach((key) => {
    // Skip excluded fields
    if (EXCLUDED_FIELDS.includes(key)) return

    const beforeValue = before?.[key]
    const afterValue = after?.[key]

    // If both are plain objects (like investment group), check nested fields
    if (isPlainObject(beforeValue) && isPlainObject(afterValue)) {
      const nestedChanges = getNestedChanges(beforeValue, afterValue, key)
      changed.push(...nestedChanges)
    } 
    // Otherwise compare the values directly
    else if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      changed.push({
        field: key,
        before: beforeValue,
        after: afterValue,
      })
    }
  })

  return changed
}

/**
 * Format a value for display (simplify IDs to just show count)
 */
function formatValueForDisplay(value: any, fieldName: string): any {
  // If it's an array of IDs (relationship field), just show count
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    // Check if it looks like UUIDs (relationship IDs)
    const looksLikeIds = value.every((v: any) => 
      typeof v === 'string' && (v.includes('-') || v.length > 20)
    )
    if (looksLikeIds) {
      return `[${value.length} item${value.length !== 1 ? 's' : ''}]`
    }
  }
  
  // If it's a single ID string (relationship), simplify it
  if (typeof value === 'string' && value.includes('-') && value.length > 20) {
    return '[ID]'
  }
  
  // For objects, check if they're too large
  if (isPlainObject(value)) {
    const jsonStr = JSON.stringify(value)
    if (jsonStr.length > 200) {
      return '[Complex Object]'
    }
  }
  
  return value
}

/**
 * Build a compact changes object with only the modified fields
 */
function buildCompactChanges(changedFields: { field: string; before: any; after: any }[]): any {
  const changes: any = {}

  changedFields.forEach(({ field, before, after }) => {
    changes[field] = {
      before: formatValueForDisplay(before, field),
      after: formatValueForDisplay(after, field),
    }
  })

  return changes
}

/**
 * Get client IP address from request
 */
function getIpAddress(req: any): string | undefined {
  const forwardedFor = req.headers?.get?.('x-forwarded-for') || req.headers?.['x-forwarded-for']
  const realIp = req.headers?.get?.('x-real-ip') || req.headers?.['x-real-ip']

  return (
    (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0] : undefined) ||
    realIp ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress
  )
}

/**
 * Get user agent from request
 */
function getUserAgent(req: any): string | undefined {
  return req.headers?.get?.('user-agent') || req.headers?.['user-agent']
}

/**
 * After Change Hook - Logs create and update operations
 */
export const afterChangeHook: AfterChangeHook = async ({
  doc,
  req,
  operation,
  collection,
  previousDoc,
}) => {
  // Skip if collection is excluded
  if (EXCLUDED_COLLECTIONS.includes(collection.slug)) {
    return doc
  }

  try {
    const changedFields = operation === 'update' ? getChangedFields(previousDoc, doc) : []

    // Only log if there are actual changes (for updates)
    if (operation === 'update' && changedFields.length === 0) {
      return doc
    }

    // Build compact changes object (only changed fields with before/after values)
    const changes = operation === 'update' 
      ? buildCompactChanges(changedFields)
      : { summary: 'Record created' }

    // Create audit log entry
    await req.payload.create({
      collection: 'auditLogs' as any,
      data: {
        collection: collection.slug,
        recordId: doc.id,
        operation,
        user: req.user?.id || undefined,
        changes,
        changedFields: changedFields.map(({ field }) => ({ field })),
        ipAddress: getIpAddress(req),
        userAgent: getUserAgent(req),
      },
      // Don't trigger hooks for audit log creation (prevent recursion)
      disableVerificationEmail: true,
    })
  } catch (error) {
    // Log error but don't fail the original operation
    console.error('Failed to create audit log:', error)
  }

  return doc
}

/**
 * After Delete Hook - Logs delete operations
 */
export const afterDeleteHook: AfterDeleteHook = async ({ req, id, doc, collection }) => {
  // Skip if collection is excluded
  if (EXCLUDED_COLLECTIONS.includes(collection.slug)) {
    return doc
  }

  try {
    // For deletes, store a summary with key identifying fields only
    const keyFields = ['id', 'name', 'title', 'businessName', 'email']
    const deletedSummary: any = { summary: 'Record deleted' }
    
    // Include key identifying fields if they exist
    keyFields.forEach(field => {
      if (doc?.[field] !== undefined) {
        deletedSummary[field] = doc[field]
      }
    })

    // Create audit log entry for deletion
    await req.payload.create({
      collection: 'auditLogs' as any,
      data: {
        collection: collection.slug,
        recordId: id,
        operation: 'delete',
        user: req.user?.id || undefined,
        changes: deletedSummary,
        changedFields: [],
        ipAddress: getIpAddress(req),
        userAgent: getUserAgent(req),
      },
      disableVerificationEmail: true,
    })
  } catch (error) {
    // Log error but don't fail the original operation
    console.error('Failed to create audit log for deletion:', error)
  }

  return doc
}
