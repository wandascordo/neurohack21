import * as React from 'react'
import { AuthEmailLayout, EmailParagraph } from './auth-layout'

interface InviteEmailProps { siteName: string; siteUrl: string; confirmationUrl: string }

export const InviteEmail = ({ confirmationUrl }: InviteEmailProps) => (
  <AuthEmailLayout
    title="Tu acceso está listo"
    preview="Tu acceso a Neurohack 21 ya está activo."
    buttonLabel="CREAR MI CUENTA"
    confirmationUrl={confirmationUrl}
    note="Si no esperabas este correo, ignorá este mensaje."
  >
    <EmailParagraph>Gracias por sumarte a Neurohack 21. Acá vas a entender cómo se te va la atención y a entrenarla, de a poco y a tu ritmo. Si algún día te salteás la práctica, no pasa nada: seguís donde te quedaste.</EmailParagraph>
    <EmailParagraph>Hacé click en el botón para crear tu cuenta.</EmailParagraph>
  </AuthEmailLayout>
)

export default InviteEmail
