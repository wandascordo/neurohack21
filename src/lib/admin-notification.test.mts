import { describe, expect, it } from 'bun:test'
import { notifyAdmin } from './admin-notification'
import { finishAccount } from './account-completion'

describe('administrative event notifications', () => {
  it('sends each invitation to the fixed admin with Neurohack 21 and Buenos Aires event time', async () => {
    let actual: unknown
    await notifyAdmin(async (...args) => { actual = args }, 'invitation', 'buyer@example.com', 'order-123', new Date('2026-10-23T20:20:00Z'))
    expect(actual).toEqual(['admin-invitation', 'hola@destellointerior.com', {
      templateData: { email: 'buyer@example.com', product: 'Neurohack 21', dateTime: '23/10/26, 17:20:00 (Buenos Aires)' },
      idempotencyKey: 'admin-invitation-order-123',
    }])
  })
  it('does not throw when the invitation notification fails', async () => {
    await expect(notifyAdmin(async () => { throw new Error('delivery failed') }, 'invitation', 'buyer@example.com', 'order-123')).resolves.toBeUndefined()
  })
  it('sends the registration notification to admin with buyer email and time', async () => {
    let actual: unknown
    await notifyAdmin(async (...args) => { actual = args }, 'registration', 'buyer@example.com', 'user-123', new Date('2026-10-23T20:20:00Z'))
    expect(actual).toEqual(['admin-registration', 'hola@destellointerior.com', {
      templateData: { email: 'buyer@example.com', dateTime: '23/10/26, 17:20:00 (Buenos Aires)' },
      idempotencyKey: 'admin-registration-user-123',
    }])
  })
  it('keeps registration successful if notification fails, after saving completion', async () => {
    const events: string[] = []
    const result = await finishAccount({
      readProfile: async () => ({ email: 'buyer@example.com', account_completed_at: null }),
      complete: async () => { events.push('completed'); return { error: null } },
      notify: async (email) => { events.push(email); throw new Error('send failed') },
    })
    expect(result.ok).toBe(true)
    expect(events).toEqual(['completed', 'buyer@example.com'])
  })
  it('does not notify a previously completed account', async () => {
    let notified = 0
    const result = await finishAccount({
      readProfile: async () => ({ email: 'buyer@example.com', account_completed_at: '2026-10-23T20:20:00Z' }),
      complete: async () => { throw new Error('must not run') },
      notify: async () => { notified++ },
    })
    expect(result.ok).toBe(true)
    expect(notified).toBe(0)
  })
  it('does not notify when account completion fails', async () => {
    let notified = 0
    const result = await finishAccount({
      readProfile: async () => ({ email: 'buyer@example.com', account_completed_at: null }),
      complete: async () => ({ error: new Error('save failed') }),
      notify: async () => { notified++ },
    })
    expect(result.ok).toBe(false)
    expect(notified).toBe(0)
  })
})