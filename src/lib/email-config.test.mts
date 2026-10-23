import { expect, it } from 'bun:test'
import { EMAIL_CONFIG } from './email-config'

it('uses Destello Interior as the sender name', () => {
  expect(EMAIL_CONFIG.from.name).toBe('Destello Interior')
})

it('uses hola@destellointerior.com as the sender address', () => {
  expect(EMAIL_CONFIG.from.address).toBe('hola@destellointerior.com')
})

it('sends administrative notifications to hola@destellointerior.com', () => {
  expect(EMAIL_CONFIG.adminRecipient).toBe('hola@destellointerior.com')
})