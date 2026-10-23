export const ADMIN_EMAIL = 'hola@destellointerior.com'
export const ADMIN_SENDER_NAME = 'Destello Interior'
export type AdminEvent = 'invitation' | 'registration'
type Sender = (template: string, to: string, options: { templateData: Record<string, string>; idempotencyKey: string }) => Promise<unknown>

export async function notifyAdmin(send: Sender, event: AdminEvent, email: string, eventId: string, at = new Date()) {
  const template = event === 'invitation' ? 'admin-invitation' : 'admin-registration'
  const dateTime = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires', dateStyle: 'short', timeStyle: 'medium', hourCycle: 'h23',
  }).format(at) + ' (Buenos Aires)'
  try {
    await send(template, ADMIN_EMAIL, {
      templateData: { email, dateTime, ...(event === 'invitation' ? { product: 'Neurohack 21' } : {}) },
      idempotencyKey: `${template}-${eventId}`,
    })
  } catch {
    // The buyer's invitation/registration already succeeded. Never undo it.
    console.warn('[admin-notification] send failed', { event })
  }
}