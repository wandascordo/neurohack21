import * as React from 'react'
import { AuthEmailLayout, EmailParagraph } from './auth-layout'

interface SignupEmailProps { siteName: string; siteUrl: string; recipient: string; confirmationUrl: string }

export const SignupEmail = ({ recipient, confirmationUrl }: SignupEmailProps) => (
  <AuthEmailLayout
    title="Confirmá tu email"
    preview="Confirmá tu email y empezamos."
    buttonLabel="CONFIRMAR MI EMAIL"
    confirmationUrl={confirmationUrl}
    note="Si no creaste esta cuenta, ignorá este correo."
  >
    <EmailParagraph>Tu cuenta de Neurohack 21 ya casi está lista. Confirmá que {recipient} es tu dirección y ya podés empezar.</EmailParagraph>
    <EmailParagraph>Los 21 días arrancan cuando vos decidas.</EmailParagraph>
  </AuthEmailLayout>
)

export default SignupEmail
