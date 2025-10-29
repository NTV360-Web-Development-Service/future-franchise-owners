import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

const MAIN_CONTACT_EMAIL = process.env.MAIN_CONTACT_EMAIL
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL

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
    const { name, email, phone, company, subject, message, franchiseId } = body as {
      name?: string
      email?: string
      phone?: string
      company?: string
      subject?: string
      message?: string
      franchiseId?: string
    }

    const config = await configPromise
    const payload = await getPayload({ config })

    // Extract IP address from request headers
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown'

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
      // assignedAgent can be an ID or populated doc depending on depth
      const assignedAgent: any = (franchise as any)?.assignedAgent
      const useMainContact = !!(franchise as any)?.useMainContact

      if (isTopPick && assignedAgent && !useMainContact) {
        let agentDoc = assignedAgent
        if (typeof assignedAgent === 'string') {
          // Cast to any to avoid CollectionSlug type mismatch until Payload types regenerate
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
      const ok = await postToWebhook(targetWebhook, {
        name,
        email,
        phone,
        company,
        subject,
        message,
        franchiseId,
      })
      if (!ok) return NextResponse.json({ error: 'Webhook failed' }, { status: 502 })
      return NextResponse.json({ ok: true, routed: 'webhook', submissionId })
    }

    if (targetEmail) {
      // TODO: Integrate email provider (e.g., SendGrid, Resend)
      console.log('Send email to:', targetEmail, {
        name,
        email,
        phone,
        company,
        subject,
        message,
        franchiseId,
      })
      return NextResponse.json({ ok: true, routed: 'email', submissionId })
    }

    return NextResponse.json({ error: 'No routing configured' }, { status: 500 })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
