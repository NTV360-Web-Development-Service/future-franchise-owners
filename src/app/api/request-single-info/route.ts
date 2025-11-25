import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { generateAdminEmailHTML, generateUserConfirmationHTML } from '@/lib/email-templates-cart'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, franchise } = body

    // Validate required fields
    if (!name || !email || !phone || !franchise) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build franchise info for email
    const franchiseInfo = `${franchise.name}\n   Category: ${franchise.category}\n   Investment: ${franchise.cashRequired}`

    // Email content for admin
    const adminEmailSubject = `Franchise Information Request from ${name}`
    const adminEmailBody = `
New franchise information request:

CONTACT INFORMATION:
Name: ${name}
Email: ${email}
Phone: ${phone}

FRANCHISE REQUESTED:
${franchiseInfo}

${message ? `MESSAGE:\n${message}` : ''}

---
This request was submitted via the franchise detail page on ${new Date().toLocaleString()}
    `.trim()

    // Email content for user
    const userEmailSubject = 'Your Franchise Information Request'
    const userEmailBody = `
Hi ${name},

Thank you for your interest in ${franchise.name}! We've received your request for information.

FRANCHISE DETAILS:
${franchiseInfo}

WHAT'S NEXT?
• Our team will review your request
• You'll receive detailed information about this franchise within 24-48 hours
• A franchise consultant may reach out to discuss your interests

CONTACT INFORMATION:
If you have any questions in the meantime, feel free to reach out:
• Email: info@yourcompany.com
• Phone: (555) 123-4567

We're excited to help you explore this franchise opportunity!

Best regards,
The Franchise Team

---
Request submitted on ${new Date().toLocaleString()}
    `.trim()

    // Generate HTML emails
    const adminEmailHTML = generateAdminEmailHTML({
      name,
      email,
      phone,
      message,
      franchises: [franchise],
    })

    const userEmailHTML = generateUserConfirmationHTML({
      name,
      franchises: [franchise],
    })

    // Send email to admin/sales team
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.MAIN_CONTACT_EMAIL || 'efraimg@n-compass.biz',
        subject: adminEmailSubject,
        html: adminEmailHTML,
        text: adminEmailBody,
      })
    } catch (emailError) {
      console.error('Failed to send admin email:', emailError)
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: userEmailSubject,
        html: userEmailHTML,
        text: userEmailBody,
      })
    } catch (emailError) {
      console.error('Failed to send user confirmation email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
