import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateAdminEmailHTML, generateUserConfirmationHTML } from '@/lib/email-templates-cart'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Verify Turnstile token
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    console.warn('Turnstile secret key not configured, skipping verification')
    return true
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    })
    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, franchise, turnstileToken } = body

    // Verify Turnstile token
    if (turnstileToken) {
      const isValid = await verifyTurnstile(turnstileToken)
      if (!isValid) {
        return NextResponse.json({ error: 'Security verification failed' }, { status: 400 })
      }
    }

    // Validate required fields
    if (!name || !email || !phone || !franchise) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Initialize Payload to look up franchise agent
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Determine recipient email (agent or main contact)
    let recipientEmail = process.env.MAIN_CONTACT_EMAIL || 'efraimg@n-compass.biz'
    let shouldCcMain = false
    const mainContactEmail = recipientEmail

    // Look up the franchise to check for assigned agent
    if (franchise.id) {
      try {
        const franchiseDoc = await payload.findByID({
          collection: 'franchises',
          id: franchise.id,
          depth: 1, // Populate assignedAgent
        })

        // Check if franchise has an assigned agent and useMainContact is not true
        if (
          franchiseDoc?.assignedAgent &&
          !franchiseDoc.useMainContact &&
          typeof franchiseDoc.assignedAgent === 'object' &&
          franchiseDoc.assignedAgent.email &&
          franchiseDoc.assignedAgent.isActive
        ) {
          recipientEmail = franchiseDoc.assignedAgent.email
          shouldCcMain = franchiseDoc.ccMainContact === true
        }
      } catch (lookupError) {
        console.error(`Failed to look up franchise ${franchise.id}:`, lookupError)
        // Fall back to main contact
      }
    }

    // Build franchise info for email
    const franchiseInfo = `${franchise.name}\n   Category: ${franchise.category}\n   Investment: ${franchise.cashRequired}`

    // Email content for admin/agent
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

    // Send email to agent or main contact
    try {
      const emailOptions: any = {
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: recipientEmail,
        subject: adminEmailSubject,
        html: adminEmailHTML,
        text: adminEmailBody,
      }

      // Add CC to main contact if enabled and recipient is not already main contact
      if (shouldCcMain && recipientEmail !== mainContactEmail) {
        emailOptions.cc = mainContactEmail
      }

      await resend.emails.send(emailOptions)
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
