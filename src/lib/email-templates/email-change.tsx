import * as React from 'react'
import { AuthEmailLayout, EmailParagraph } from './auth-layout'

interface EmailChangeEmailProps { siteName: string; oldEmail: string; email: string; newEmail: string; confirmationUrl: string }

export const EmailChangeEmail = ({ newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <AuthEmailLayout
    title="Confirmá tu nuevo email"
    preview="Un último paso para actualizar tu cuenta."
    buttonLabel="CONFIRMAR NUEVO EMAIL"
    confirmationUrl={confirmationUrl}
    note="Si no pediste este cambio, ignorá este correo. Tu email actual no se modifica."
  >
    <EmailParagraph>Pediste cambiar el email de tu cuenta a {newEmail}. Confirmalo con un click y, desde ahora, vas a ingresar con esa dirección.</EmailParagraph>
    <EmailParagraph>Tu progreso, tus notas y tus registros siguen exactamente donde estaban.</EmailParagraph>
  </AuthEmailLayout>
)

export default EmailChangeEmail
