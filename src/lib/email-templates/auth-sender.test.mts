import { expect, it, mock } from 'bun:test'
import { EMAIL_CONFIG } from '../email-config'

it('passes the shared sender to all six authentication emails', async () => {
  let captured: any
  mock.module('@lovable.dev/email-js', () => ({
    createAuthEmailHandler: (options: any) => {
      captured = options
      return async () => Response.json({ ok: true })
    },
  }))
  const previous = process.env['LOVABLE_API_KEY']
  process.env['LOVABLE_API_KEY'] = 'mock-test-only'
  try {
    const { Route } = await import('../../routes/lovable/email/auth/webhook')
    await Route.options.server.handlers.POST({ request: new Request('http://localhost/lovable/email/auth/webhook', { method: 'POST' }) })
    expect(captured.from).toEqual({ name: 'Destello Interior', address: 'hola@destellointerior.com' })
    expect(captured.from).toBe(EMAIL_CONFIG.from)
    expect(captured.senderDomain).toBe(EMAIL_CONFIG.senderDomain)
    expect(Object.keys(captured.emails).sort()).toEqual(['email_change', 'invite', 'magiclink', 'reauthentication', 'recovery', 'signup'])
  } finally {
    if (previous === undefined) delete process.env['LOVABLE_API_KEY']
    else process.env['LOVABLE_API_KEY'] = previous
    mock.restore()
  }
})