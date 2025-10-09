import React from 'react'

export default function AdminImportLink() {
  return (
    <a
      href="/import/franchises"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 6,
        backgroundColor: '#2563eb',
        color: 'white',
        textDecoration: 'none',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {/* Simple icon dot */}
      <span
        style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: 9999,
          backgroundColor: '#222222',
        }}
      />
      Import Franchises
    </a>
  )
}
