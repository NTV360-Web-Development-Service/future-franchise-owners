import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { generateAdminEmailHTML, generateUserConfirmationHTML } from '@/lib/email-templates-cart'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, franchises } = body

    // Validate required fields
    if (!name || !email || !phone || !franchises || franchises.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build franchise list for email
    const franchiseList = franchises
      .map(
        (f: any, index: number) =>
          `${index + 1}. ${f.name}\n   Category: ${f.category}\n   Investment: ${f.cashRequired}`,
      )
      .join('\n\n')

    // Email to admin/sales team
    const adminEmailSubject = `Franchise Information Request from ${name}`
    const adminEmailBody = `
New franchise information request:

CONTACT INFORMATION:
Name: ${name}
Email: ${email}
Phone: ${phone}

FRANCHISES REQUESTED (${franchises.length}):
${franchiseList}

${message ? `MESSAGE:\n${message}` : ''}

---
This request was submitted via the cart on ${new Date().toLocaleString()}
    `.trim()

    // Confirmation email to user
    const userEmailSubject = 'Your Franchise Information Request'
    const userEmailBody = `
Hi ${name},

Thank you for your interest in our franchise opportunities! We've received your request for information about the following franchises:

${franchiseList}

WHAT'S NEXT?
• Our team will review your request
• You'll receive detailed information about each franchise within 24-48 hours
• A franchise consultant may reach out to discuss your interests

CONTACT INFORMATION:
If you have any questions in the meantime, feel free to reach out:
• Email: info@yourcompany.com
• Phone: (555) 123-4567

We're excited to help you find the perfect franchise opportunity!

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
      franchises,
    })

    const userEmailHTML = generateUserConfirmationHTML({
      name,
      franchises,
    })

    // Send email to admin/sales team
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.MAIN_CONTACT_EMAIL || 'efraimg@n-compass.biz',
        subject: adminEmailSubject,
        html: adminEmailHTML,
        text: adminEmailBody, // Fallback for email clients that don't support HTML
      })
    } catch (emailError) {
      console.error('Failed to send admin email:', emailError)
      // Continue even if admin email fails
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: userEmailSubject,
        html: userEmailHTML,
        text: userEmailBody, // Fallback
      })
    } catch (emailError) {
      console.error('Failed to send user confirmation email:', emailError)
      // Continue even if user email fails
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
