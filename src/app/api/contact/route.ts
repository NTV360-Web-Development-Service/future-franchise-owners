import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { Resend } from 'resend'
import configPromise from '@/payload.config'
import { getUserConfirmationEmail } from '@/lib/email-templates'

const MAIN_CONTACT_EMAIL = process.env.MAIN_CONTACT_EMAIL
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com'

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

async function postToWebhook(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.ok
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const franchiseId = body.franchiseId

    const config = await configPromise
    const payload = await getPayload({ config })

    // Extract IP address from request headers
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown'

    // Smart field mapping - automatically detect common field name variations
    const name =
      body.name || body.fullName || body.firstName || body.contactName || body.yourName || ''
    const email = body.email || body.emailAddress || body.contactEmail || ''
    const phone =
      body.phone || body.phoneNumber || body.telephone || body.contactPhone || body.mobile || ''
    const company =
      body.company ||
      body.companyName ||
      body.organization ||
      (body.city && body.state ? `${body.city}, ${body.state}` : body.city || body.state) ||
      ''
    const subject = body.subject || body.topic || body.regarding || ''

    // Combine all non-standard fields into message
    const standardFields = [
      'name',
      'fullName',
      'firstName',
      'contactName',
      'yourName',
      'email',
      'emailAddress',
      'contactEmail',
      'phone',
      'phoneNumber',
      'telephone',
      'contactPhone',
      'mobile',
      'company',
      'companyName',
      'organization',
      'city',
      'state',
      'subject',
      'topic',
      'regarding',
      'message',
      'comments',
      'inquiry',
      'details',
      'franchiseId',
    ]
    const customFields = Object.entries(body)
      .filter(([key]) => !standardFields.includes(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')

    const message = [
      body.message || body.comments || body.inquiry || body.details || '',
      customFields ? `\n\nAdditional Information:\n${customFields}` : '',
    ]
      .filter(Boolean)
      .join('')

    // Store submission in database
    let submissionId: string | undefined
    try {
      const submission = await payload.create({
        collection: 'contactSubmissions',
        data: {
          name: name || undefined,
          email: email || undefined,
          phone: phone || undefined,
          company: company || undefined,
          subject: subject || undefined,
          message: message || undefined,
          ipAddress,
          status: 'new',
        },
      })
      submissionId = submission.id
    } catch (dbError) {
      console.error('Failed to store submission:', dbError)
      // Continue with routing even if database storage fails
    }

    let targetEmail: string | undefined
    let targetWebhook: string | undefined

    if (franchiseId) {
      const franchise = await payload.findByID({
        collection: 'franchises',
        id: franchiseId,
        depth: 1,
      })

      const isTopPick = !!franchise?.isTopPick
      const assignedAgent: any = (franchise as any)?.assignedAgent
      const useMainContact = !!(franchise as any)?.useMainContact

      if (isTopPick && assignedAgent && !useMainContact) {
        let agentDoc = assignedAgent
        if (typeof assignedAgent === 'string') {
          agentDoc = await payload.findByID({ collection: 'agents' as any, id: assignedAgent })
        }
        targetEmail = agentDoc?.email
        targetWebhook = agentDoc?.ghlWebhook
      }
    }

    // Fallback routing to global settings
    if (!targetEmail && MAIN_CONTACT_EMAIL) targetEmail = MAIN_CONTACT_EMAIL
    if (!targetWebhook && GHL_WEBHOOK_URL) targetWebhook = GHL_WEBHOOK_URL

    // Prefer webhook when available
    if (targetWebhook) {
      const ok = await postToWebhook(targetWebhook, body)
      if (!ok) {
        console.warn('Webhook failed, but submission was saved')
        return NextResponse.json({
          ok: true,
          routed: 'database',
          submissionId,
          warning: 'Webhook delivery failed',
        })
      }
      return NextResponse.json({ ok: true, routed: 'webhook', submissionId })
    }

    // Send emails if Resend is configured
    if (resend) {
      try {
        // Send notification to business owner/agent if configured
        if (targetEmail) {
          const emailBody = Object.entries(body)
            .filter(([key]) => key !== 'franchiseId')
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join('<br/>')

          await resend.emails.send({
            from: FROM_EMAIL,
            to: targetEmail,
            subject: subject || 'New Contact Form Submission',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="background: linear-gradient(135deg, #004AAD 0%, #001C40 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Contact Submission</h1>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px;">
                              <div style="background-color: #f8f9fa; border-left: 4px solid #004AAD; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                                ${emailBody}
                              </div>
                              <p style="color: #6c757d; font-size: 12px; margin: 0; padding-top: 20px; border-top: 1px solid #e9ecef;">
                                Submission ID: ${submissionId}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `,
          })
        }

        // ALWAYS send confirmation email to the user if they provided an email
        if (email) {
          console.log('Sending confirmation email to:', email)
          const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Thank you for contacting Future Franchise Owners',
            html: getUserConfirmationEmail({ name, message }),
          })
          console.log('Confirmation email sent:', result)
        } else {
          console.log('No email provided, skipping confirmation email')
        }

        return NextResponse.json({ ok: true, routed: 'email', submissionId })
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        return NextResponse.json({
          ok: true,
          routed: 'database',
          submissionId,
          warning: 'Email delivery failed',
        })
      }
    }

    // No routing configured, but submission was saved successfully
    console.log(
      'Contact submission saved to database (no email/webhook routing configured):',
      submissionId,
    )
    return NextResponse.json({ ok: true, routed: 'database', submissionId })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
