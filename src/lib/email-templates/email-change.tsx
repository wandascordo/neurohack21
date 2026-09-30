import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Confirmá tu nuevo email en {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>{siteName}</Text>
        <Heading style={h1}>Confirmá tu nuevo email</Heading>
        <Text style={text}>
          Pediste cambiar el email de tu cuenta de {siteName} a{' '}
          <strong>{newEmail}</strong>. Hacé clic en el botón para confirmar el
          cambio.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirmar nuevo email
        </Button>
        <Text style={footer}>
          Si no pediste este cambio, podés ignorar este correo. Tu email
          actual no va a cambiar.
        </Text>
        <Text style={credit}>Producto desarrollado por Destello Interior</Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '32px 25px' }
const eyebrow = {
  fontSize: '12px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: '#6b7469',
  margin: '0 0 12px',
}
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#1c1c1c',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const button = {
  backgroundColor: '#6b7469',
  color: '#ffffff',
  fontSize: '14px',
  borderRadius: '999px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
const credit = { fontSize: '11px', color: '#b5b5b5', margin: '16px 0 0' }
