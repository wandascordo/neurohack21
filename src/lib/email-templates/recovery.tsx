import * as React from 'react'
import { AuthEmailLayout, EmailParagraph } from './auth-layout'

interface RecoveryEmailProps { siteName: string; confirmationUrl: string }

export const RecoveryEmail = ({ confirmationUrl }: RecoveryEmailProps) => (
  <AuthEmailLayout
    title="Elegí una contraseña nueva"
    preview="Le pasa a todo el mundo. Lo resolvemos en un minuto."
    buttonLabel="ELEGIR CONTRASEÑA NUEVA"
    confirmationUrl={confirmationUrl}
    note="Si no pediste este cambio, ignorá este correo. Tu contraseña actual sigue igual."
  >
    <EmailParagraph>Olvidarse una contraseña es de lo más común, no hace falta darle más vueltas. Hacé click en el botón y elegí una nueva para tu cuenta de Neurohack 21.</EmailParagraph>
  </AuthEmailLayout>
)

export default RecoveryEmail
