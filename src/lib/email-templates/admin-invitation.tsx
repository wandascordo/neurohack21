import { Body, Container, Head, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

function AdminInvitation({ email = '', product = 'Neurohack 21', dateTime = '' }: { email?: string; product?: string; dateTime?: string }) {
  return <Html lang="es"><Head /><Preview>Invitación enviada a un comprador</Preview><Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}><Container style={{ padding: '24px' }}><Text>Se envió una invitación.</Text><Text>Email: {email}<br />Producto: {product}<br />Fecha y hora: {dateTime}</Text></Container></Body></Html>
}

export const template = {
  component: AdminInvitation,
  subject: 'Invitación enviada · Neurohack 21',
  displayName: 'Administración: invitación enviada',
  to: 'hola@destellointerior.com',
  previewData: { email: 'comprador@example.com', product: 'Neurohack 21', dateTime: '23/10/2026, 17:20:00 (Buenos Aires)' },
} satisfies TemplateEntry