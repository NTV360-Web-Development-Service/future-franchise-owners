import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract common fields (support both 'name' and 'fullName')
    const contactName = body.name || body.fullName || 'Unknown'
    const email = body.email
    const phone = body.phone
    const contactSubject = body.subject || 'Contact Form Submission'
    const contactMessage = body.message || ''

    // Validate required fields
    if (!email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build dynamic field list for email (exclude common fields we already handle)
    const excludeFields = ['name', 'fullName', 'email', 'phone', 'subject', 'message']
    const additionalFields = Object.entries(body)
      .filter(([key]) => !excludeFields.includes(key))
      .map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        value: String(value),
      }))

    // Email to admin
    const adminEmailSubject = `New Contact: ${contactSubject}`
    const adminEmailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #004AAD 0%, #003A8C 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">📞 New Contact Request</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 18px;">Contact Information</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #374151;">Name:</strong>
                    <span style="color: #111827; margin-left: 10px;">${contactName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #374151;">Email:</strong>
                    <a href="mailto:${email}" style="color: #004AAD; margin-left: 10px; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #374151;">Phone:</strong>
                    <a href="tel:${phone}" style="color: #004AAD; margin-left: 10px; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                ${
                  contactSubject !== 'Contact Form Submission'
                    ? `<tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #374151;">Subject:</strong>
                    <span style="color: #111827; margin-left: 10px;">${contactSubject}</span>
                  </td>
                </tr>`
                    : ''
                }
                ${additionalFields
                  .map(
                    (field) => `<tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #374151;">${field.label}:</strong>
                    <span style="color: #111827; margin-left: 10px;">${field.value}</span>
                  </td>
                </tr>`,
                  )
                  .join('')}
              </table>
            </td>
          </tr>

          ${
            contactMessage
              ? `<tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Message</h2>
              <div style="background-color: #f9fafb; border-left: 4px solid #004AAD; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${contactMessage}</p>
              </div>
            </td>
          </tr>`
              : ''
          }

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px;">
                    <a href="mailto:${email}" style="display: inline-block; background-color: #004AAD; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600;">
                      📧 Reply to ${contactName}
                    </a>
                  </td>
                  <td align="center" style="padding: 10px;">
                    <a href="tel:${phone}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600;">
                      📞 Call ${contactName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Submitted on ${new Date().toLocaleString()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    // Confirmation email to user
    const userEmailSubject = 'We Received Your Message'
    const userEmailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">✅ Message Received!</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px;">
                Hi <strong>${contactName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 15px; line-height: 1.6;">
                Thank you for reaching out! We've received your message and will get back to you within 24 hours.
              </p>
            </td>
          </tr>

          ${
            contactMessage
              ? `<tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #eff6ff; border-left: 4px solid #004AAD; padding: 20px; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #004AAD; font-size: 16px;">Your Message:</h3>
                <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${contactMessage}</p>
              </div>
            </td>
          </tr>`
              : ''
          }

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; text-align: center;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px;">Need Immediate Assistance?</h3>
                <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
                  Feel free to reach out directly:
                </p>
                <p style="margin: 0;">
                  <a href="mailto:info@yourcompany.com" style="color: #004AAD; text-decoration: none;">📧 info@yourcompany.com</a>
                  <span style="color: #d1d5db; margin: 0 10px;">|</span>
                  <a href="tel:+15551234567" style="color: #004AAD; text-decoration: none;">📞 (555) 123-4567</a>
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <p style="margin: 0; color: #374151; font-size: 15px;">
                Best regards,<br>
                <strong>The Franchise Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Submitted on ${new Date().toLocaleString()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    // Send emails
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.MAIN_CONTACT_EMAIL || 'efraimg@n-compass.biz',
        subject: adminEmailSubject,
        html: adminEmailHTML,
      })
    } catch (emailError) {
      console.error('Failed to send admin email:', emailError)
    }

    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: userEmailSubject,
        html: userEmailHTML,
      })
    } catch (emailError) {
      console.error('Failed to send user confirmation email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
