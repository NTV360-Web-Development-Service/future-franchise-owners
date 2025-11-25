'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ContactModal } from '@/components/contact/ContactModal'

export function ConsultationButton() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="w-full bg-white text-slate-900 hover:bg-gray-100"
      >
        Request Free Consultation
      </Button>

      <ContactModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
