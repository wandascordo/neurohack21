import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({
  token,
}: ReauthenticationEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu código de verificación</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>Neurohack 21</Text>
        <Heading style={h1}>Tu código de verificación</Heading>
        <Text style={text}>
          Ingresá este código para continuar con la acción solicitada:
        </Text>
        <Text style={code}>{token}</Text>
        <Text style={footer}>
          Si no solicitaste este código, podés ignorar este correo.
        </Text>
        <Text style={credit}>Producto desarrollado por Destello Interior</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const code = {
  fontSize: '28px',
  fontWeight: 'bold' as const,
  letterSpacing: '6px',
  color: '#1c1c1c',
  margin: '0 0 25px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
const credit = { fontSize: '11px', color: '#b5b5b5', margin: '16px 0 0' }
