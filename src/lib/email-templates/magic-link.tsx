import * as React from 'react'
import { AuthEmailLayout, EmailParagraph } from './auth-layout'

interface MagicLinkEmailProps { siteName: string; confirmationUrl: string }

export const MagicLinkEmail = ({ confirmationUrl }: MagicLinkEmailProps) => (
  <AuthEmailLayout
    title="Tu espacio de foco te espera"
    preview="Una respiración y estás adentro."
    buttonLabel="ENTRAR A MI CUENTA"
    confirmationUrl={confirmationUrl}
    note="Si no pediste este enlace, ignorá este correo. No cambia nada en tu cuenta."
  >
    <EmailParagraph>Antes de entrar, una respiración: inhalá 5 segundos, exhalá 5. Después, tocá el botón.</EmailParagraph>
    <EmailParagraph>Este enlace es solo tuyo: funciona una vez y vence en breve, así que usalo ahora.</EmailParagraph>
  </AuthEmailLayout>
)

export default MagicLinkEmail
