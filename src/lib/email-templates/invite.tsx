import * as React from 'react'
import { Link, Section, Text } from '@react-email/components'
import { AuthEmailLayout, EmailParagraph, emailColors, paragraphStyle } from './auth-layout'

interface InviteEmailProps { siteName: string; siteUrl: string; confirmationUrl: string; plan?: 'neurohack' | 'experiencia' }

const subtitulo: React.CSSProperties = { ...paragraphStyle, fontSize: '20px', lineHeight: '1.3', fontWeight: 600, margin: '0 0 12px' }
const tarjeta: React.CSSProperties = { backgroundColor: emailColors.help, borderRadius: '10px', padding: '16px', margin: '0 0 12px' }
const tituloTarjeta: React.CSSProperties = { ...paragraphStyle, fontWeight: 600, margin: '0 0 4px' }
const boton: React.CSSProperties = { display: 'inline-block', border: `1px solid ${emailColors.salvia}`, color: emailColors.salvia, fontSize: '14px', fontWeight: 600, lineHeight: '16px', borderRadius: '999px', padding: '10px 18px', textDecoration: 'none', margin: '6px 8px 0 0', fontFamily: paragraphStyle.fontFamily }
const lista: React.CSSProperties = { ...paragraphStyle, margin: '0 0 12px', paddingLeft: '20px' }

const Descargas = () => (
  <Section style={{ padding: '20px 10px 0' }}>
    <Text style={subtitulo}>Tus descargas de la Experiencia completa</Text>
    <div style={tarjeta}>
      <Text style={tituloTarjeta}>Plantillas imprimibles</Text>
      <Text style={{ ...paragraphStyle, margin: '0 0 6px' }}>5 plantillas en PDF A4 para completar a mano.</Text>
      <Link href="https://drive.google.com/drive/folders/15_M_xZM86fZyZQVmoOAYvqmPrCfThCLu?usp=sharing" style={boton}>Descargar plantillas</Link>
    </div>
    <div style={tarjeta}>
      <Text style={tituloTarjeta}>Fondos de pantalla</Text>
      <Text style={{ ...paragraphStyle, margin: '0 0 6px' }}>16 diseños con 8 mensajes recordatorios. Elegí el tema que prefieras.</Text>
      <Link href="https://drive.google.com/drive/folders/1boOjOHWO2pT8z52pjCjvzd_w4iKl-g3p?usp=sharing" style={boton}>Tema claro</Link>
      <Link href="https://drive.google.com/drive/folders/1tzn_IJiwlQqk3kiffCuZvnhIiid94fCl?usp=sharing" style={boton}>Tema oscuro</Link>
    </div>
    <Text style={{ ...subtitulo, margin: '20px 0 12px' }}>Cómo poner tu fondo de pantalla</Text>
    <Text style={tituloTarjeta}>En iPhone:</Text>
    <ol style={lista}>
      <li>Descargá la imagen y abrila en Fotos.</li>
      <li>Tocá el botón Compartir y elegí “Usar como fondo de pantalla”.</li>
      <li>Tocá “Agregar” y elegí “Pantalla de bloqueo”.</li>
    </ol>
    <Text style={tituloTarjeta}>En Android:</Text>
    <ol style={lista}>
      <li>Descargá la imagen y abrila en Galería o Google Fotos.</li>
      <li>Tocá los tres puntos y elegí “Usar como” o “Establecer como fondo de pantalla”.</li>
      <li>Elegí “Pantalla de bloqueo”.</li>
    </ol>
  </Section>
)

export const InviteEmail = ({ confirmationUrl, plan = 'neurohack' }: InviteEmailProps) => {
  const exp = plan === 'experiencia'
  return (
    <AuthEmailLayout
      title="Tu acceso está listo"
      preview="Tu acceso a Neurohack 21 ya está activo."
      buttonLabel="CREAR MI CUENTA"
      confirmationUrl={confirmationUrl}
      note="Si no esperabas este correo, ignorá este mensaje."
      afterButton={exp ? <Descargas /> : undefined}
    >
      {exp ? (
        <>
          <EmailParagraph>Gracias por sumarte a Neurohack 21, la experiencia completa. Acá vas a entender cómo se te va la atención y a entrenarla, de a poco y a tu ritmo. Si algún día te salteás la práctica, no pasa nada: seguís donde te quedaste.</EmailParagraph>
          <EmailParagraph>Hacé click en el botón para crear tu cuenta y entrar al libro-app con sus 6 mini apps.</EmailParagraph>
        </>
      ) : (
        <>
          <EmailParagraph>Gracias por sumarte a Neurohack 21. Acá vas a entender cómo se te va la atención y a entrenarla, de a poco y a tu ritmo. Si algún día te salteás la práctica, no pasa nada: seguís donde te quedaste.</EmailParagraph>
          <EmailParagraph>Hacé click en el botón para crear tu cuenta.</EmailParagraph>
        </>
      )}
    </AuthEmailLayout>
  )
}

export default InviteEmail
