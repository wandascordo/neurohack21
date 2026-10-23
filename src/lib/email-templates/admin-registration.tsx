import { Body, Container, Head, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

function AdminRegistration({ email = '', dateTime = '' }: { email?: string; dateTime?: string }) {
  return <Html lang="es"><Head /><Preview>Un usuario completó su registro</Preview><Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}><Container style={{ padding: '24px' }}><Text>Un usuario completó su registro y creó su contraseña.</Text><Text>Email: {email}<br />Fecha y hora: {dateTime}</Text></Container></Body></Html>
}

export const template = {
  component: AdminRegistration,
  subject: 'Registro completado · Neurohack 21',
  displayName: 'Administración: registro completado',
  to: 'hola@destellointerior.com',
  previewData: { email: 'comprador@example.com', dateTime: '23/10/2026, 17:20:00 (Buenos Aires)' },
} satisfies TemplateEntry