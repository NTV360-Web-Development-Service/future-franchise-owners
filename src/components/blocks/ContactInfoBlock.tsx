import React from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

interface ContactInfoBlockProps {
  block: {
    published?: boolean | null
    heading?: string | null
    contactDetails?: {
      showPhone?: boolean | null
      phone?: string | null
      showEmail?: boolean | null
      email?: string | null
      showAddress?: boolean | null
      address?: string | null
      showHours?: boolean | null
      hours?: string | null
    } | null
    showMap?: boolean | null
    mapUrl?: string | null
    mapHeight?: number | null
    id?: string | null
    blockName?: string | null
    blockType?: string
  }
}

export const ContactInfoBlock: React.FC<ContactInfoBlockProps> = ({ block }) => {
  const heading = block.heading || 'Contact Information'
  const contactDetails = block.contactDetails || {}

  const showPhone = contactDetails.showPhone ?? true
  const phone = contactDetails.phone
  const showEmail = contactDetails.showEmail ?? true
  const email = contactDetails.email
  const showAddress = contactDetails.showAddress ?? true
  const address = contactDetails.address
  const showHours = contactDetails.showHours ?? false
  const hours = contactDetails.hours

  const showMap = block.showMap ?? false
  const mapUrl = block.mapUrl
  const mapHeight = block.mapHeight || 300

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{heading}</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="space-y-6">
              {showPhone && phone && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#004AAD] mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                    <a
                      href={`tel:${phone.replace(/\D/g, '')}`}
                      className="text-gray-700 hover:text-[#004AAD] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {showEmail && email && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#004AAD] mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-700 hover:text-[#004AAD] transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {showAddress && address && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#004AAD] mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-700 whitespace-pre-line">{address}</p>
                  </div>
                </div>
              )}

              {showHours && hours && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#004AAD] mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-700 whitespace-pre-line">{hours}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            {showMap && mapUrl && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height={mapHeight}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactInfoBlock
