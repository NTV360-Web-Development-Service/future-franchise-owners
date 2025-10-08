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
    const { name, email, message, franchiseId } = body as {
      name: string
      email: string
      message: string
      franchiseId?: string
    }

    const config = await configPromise
    const payload = await getPayload({ config })

    let targetEmail: string | undefined
    let targetWebhook: string | undefined

    if (franchiseId) {
      const franchise = await payload.findByID({ collection: 'franchises', id: franchiseId, depth: 1 })

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
      const ok = await postToWebhook(targetWebhook, { name, email, message, franchiseId })
      if (!ok) return NextResponse.json({ error: 'Webhook failed' }, { status: 502 })
      return NextResponse.json({ ok: true, routed: 'webhook' })
    }

    if (targetEmail) {
      // TODO: Integrate email provider (e.g., SendGrid, Resend)
      console.log('Send email to:', targetEmail, { name, email, message, franchiseId })
      return NextResponse.json({ ok: true, routed: 'email' })
    }

    return NextResponse.json({ error: 'No routing configured' }, { status: 500 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}