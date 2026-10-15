import * as React from 'react'
import { Text } from '@react-email/components'
import { AuthEmailLayout, EmailParagraph, paragraphStyle } from './auth-layout'

interface ReauthenticationEmailProps { token: string }

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <AuthEmailLayout
    title="Tu código de verificación"
    preview="Es solo para vos."
    note="Si no lo pediste, ignorá este correo y no compartas el código con nadie."
  >
    <EmailParagraph>Ingresá este código para confirmar que sos vos y seguir con lo que estabas haciendo. Es solo tuyo y vence en breve.</EmailParagraph>
    <Text style={{ ...paragraphStyle, fontSize: '36px', lineHeight: '1.2', fontWeight: 700, margin: '30px 0 10px', userSelect: 'text' }}>{token}</Text>
  </AuthEmailLayout>
)

export default ReauthenticationEmail
