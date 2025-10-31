'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

/**
 * ShortDescriptionField - Custom Payload CMS field component
 *
 * Provides a textarea with live character count and warning when exceeding 200 characters
 */
const ShortDescriptionField: React.FC<any> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })

  const length = typeof value === 'string' ? value.length : 0
  const isWarning = length > 200

  // Get label from field config
  const label = field?.label || field?.name
  const required = field?.required
  const description = field?.admin?.description

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          fontSize: '13px',
          color: '#333',
        }}
      >
        {label}
        {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
      </label>
      {description && (
        <div
          style={{
            fontSize: '12px',
            color: '#666',
            marginBottom: '0.5rem',
          }}
        >
          {description}
        </div>
      )}
      <textarea
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        placeholder={field?.admin?.placeholder || ''}
        rows={4}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontFamily: 'inherit',
          fontSize: '14px',
          resize: 'vertical',
        }}
      />
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
