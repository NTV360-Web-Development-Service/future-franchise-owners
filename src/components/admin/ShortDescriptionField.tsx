'use client'

import { TextareaField, useField } from '@payloadcms/ui'
import React from 'react'

/**
 * Custom Short Description field with character count and warning
 */
const ShortDescriptionField: React.FC<any> = (props) => {
  const { value } = useField({ path: props.path })
  const length = typeof value === 'string' ? value.length : 0
  const isWarning = length > 200

  return (
    <div>
      <TextareaField {...props} />
      <div
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.875rem',
          backgroundColor: isWarning ? '#fef3c7' : '#f3f4f6',
          color: isWarning ? '#92400e' : '#374151',
          border: isWarning ? '1px solid #fbbf24' : '1px solid #e5e7eb',
        }}
      >
        <strong>{length} characters</strong>
        {isWarning && (
          <span style={{ marginLeft: '0.5rem' }}>
            ⚠️ Recommended to keep under 200 characters for optimal display
          </span>
        )}
        {!isWarning && length > 0 && (
          <span style={{ marginLeft: '0.5rem' }}>✓ Good length for previews</span>
        )}
      </div>
    </div>
  )
}

export default ShortDescriptionField
