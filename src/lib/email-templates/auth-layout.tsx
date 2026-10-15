import * as React from 'react'
import { Body, Button, Container, Font, Head, Heading, Html, Link, Preview, Section, Text } from '@react-email/components'

// Fixed light-mode Figma tokens are inlined for Gmail and other email clients.
export const emailColors = {
  tiza: '#FEFDFB', carbon: '#1C1C1C', salvia: '#6B7B6C',
  piedra: '#A9A89F', help: '#F7F6F4', white: '#FFFFFF',
}
const fontFamily = '"Rethink Sans", Arial, Helvetica, sans-serif'

interface AuthEmailLayoutProps {
  preview: string
  title: string
  children: React.ReactNode
  buttonLabel?: string
  confirmationUrl?: string
  note: string
}

export function AuthEmailLayout({ preview, title, children, buttonLabel, confirmationUrl, note }: AuthEmailLayoutProps) {
  return (
    <Html lang="es" dir="ltr">
      <Head>
        <Font fontFamily="Rethink Sans" fallbackFontFamily={['Arial', 'Helvetica', 'sans-serif']} webFont={{ url: 'https://fonts.gstatic.com/s/rethinksans/v5/hLSwBGdD3MMIuZ35LrO5iThTs1FZ.woff2', format: 'woff2' }} fontWeight={400} fontStyle="normal" />
        <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, backgroundColor: emailColors.white, fontFamily }}>
        <Container style={{ width: '100%', maxWidth: '640px', backgroundColor: emailColors.tiza, padding: '100px 20px', textAlign: 'left' }}>
          <Text style={{ ...paragraphStyle, fontSize: '24px', lineHeight: '28px', margin: '0 10px 30px' }}>Neurohack 21™</Text>
          <Section style={{ padding: '0 10px' }}>
            <Heading as="h1" style={{ color: emailColors.carbon, fontFamily, fontSize: '36px', fontWeight: 400, lineHeight: '1.1', letterSpacing: '0', margin: '0 0 16px' }}>{title}</Heading>
            {children}
          </Section>
          {buttonLabel && confirmationUrl && (
            <Section style={{ padding: '20px 4px 10px' }}>
              <Button href={confirmationUrl} style={{ backgroundColor: emailColors.salvia, color: emailColors.white, fontFamily, fontSize: '16px', fontWeight: 600, lineHeight: '18px', borderRadius: '999px', padding: '16px 24px', textDecoration: 'none', textAlign: 'center', maxWidth: '100%', boxSizing: 'border-box' }}>{buttonLabel}</Button>
            </Section>
          )}
          <Section style={{ padding: '20px 10px 10px' }}>
            <Text style={{ ...paragraphStyle, fontSize: '14px', color: emailColors.piedra, margin: '0 0 10px' }}>{note}</Text>
          </Section>
          <table role="presentation" cellPadding="0" cellSpacing="0" style={{ maxWidth: '100%' }}><tbody><tr><td style={{ backgroundColor: emailColors.help, borderRadius: '10px', padding: '14px' }}>
            <Text style={{ ...paragraphStyle, fontSize: '12px', lineHeight: '18px', margin: 0 }}>
              <span style={{ color: emailColors.salvia }}>¿Necesitás ayuda?</span>{' '}Escribinos a{' '}
              <Link href="mailto:neurohack21@gmail.com" style={{ color: emailColors.carbon, textDecoration: 'underline' }}>neurohack21@gmail.com</Link>
            </Text>
          </td></tr></tbody></table>
        </Container>
      </Body>
    </Html>
  )
}

export const paragraphStyle: React.CSSProperties = {
  fontFamily, color: emailColors.carbon, fontSize: '16px', lineHeight: '1.5',
  letterSpacing: '0', margin: '0 0 10px', overflowWrap: 'anywhere',
}

export function EmailParagraph({ children }: { children: React.ReactNode }) {
  return <Text style={paragraphStyle}>{children}</Text>
}