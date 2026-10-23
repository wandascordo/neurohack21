// Shared delivery identity for every managed auth and app email.
const EMAIL_ADDRESS = 'hola@destellointerior.com'

export const EMAIL_CONFIG = {
  from: { name: 'Destello Interior', address: EMAIL_ADDRESS },
  adminRecipient: EMAIL_ADDRESS,
  senderDomain: 'notificaciones.destellointerior.com',
} as const