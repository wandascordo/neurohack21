import { expect, test } from 'vitest'
import { planDe } from './orders-paid'
test('pedido con 15457431617735 es experiencia', () => {
  expect(planDe({ line_items: [{ product_id: 1 }, { product_id: 15457431617735 }] })).toBe('experiencia')
})
test('pedido sin ese producto es neurohack', () => {
  expect(planDe({ line_items: [{ product_id: 999 }] })).toBe('neurohack')
})
