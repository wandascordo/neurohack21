import { expect, it, mock } from 'bun:test'

it('uses the requested fixed sender and admin recipient for both event templates', async () => {
  const requests: Array<Record<string, unknown>> = []
  mock.module('@lovable.dev/email-js', () => ({
    EmailAPIError: class extends Error {},
    sendLovableEmail: async (request: Record<string, unknown>) => { requests.push(request) },
  }))
  const previous = process.env['LOVABLE_API_KEY']
  process.env['LOVABLE_API_KEY'] = 'mock-test-only'
  try {
    const { sendTemplateEmail } = await import('./send-email')
    for (const event of ['admin-invitation', 'admin-registration']) {
      await sendTemplateEmail(event, 'not-the-admin@example.com', {
        templateData: { email: 'buyer@example.com', dateTime: '23/10/2026, 17:20:00 (Buenos Aires)' },
        idempotencyKey: `${event}-123`,
      })
    }
    expect(requests).toHaveLength(2)
    for (const request of requests) {
      expect(request['from']).toEqual({ name: 'Destello Interior', address: 'hola@destellointerior.com' })
      expect(request['to']).toBe('hola@destellointerior.com')
      expect(request['sender_domain']).toBe('notificaciones.destellointerior.com')
    }
  } finally {
    if (previous === undefined) delete process.env['LOVABLE_API_KEY']
    else process.env['LOVABLE_API_KEY'] = previous
    mock.restore()
  }
})