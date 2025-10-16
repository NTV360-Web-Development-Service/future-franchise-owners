'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

/**
 * ColorPickerField - Custom Payload CMS field component
 *
 * Provides a native HTML5 color picker input alongside a text input
 * for hex color values. Allows users to visually pick colors or enter
 * hex codes directly.
 */
const ColorPickerField: React.FC<any> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })

  // Get label from field config
  const label = field?.label || field?.name
  const required = field?.required

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
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '60px',
            height: '38px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#000000"
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        />
      </div>
    </div>
  )
}

export default ColorPickerField
