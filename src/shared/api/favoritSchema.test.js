import { describe, expect, it } from 'vitest'
import { parseFavoritPayload } from './favoritSchema.js'

describe('Favorit response contract', () => {
  it('normalizes numeric fields and missing arrays', () => {
    const goods = parseFavoritPayload({
      goods: [{
        goodsID: 42,
        brand: ' BOSCH ',
        number: ' 100 ',
        count: '3',
        warehouses: [{ id: 7, price: '199.50', stock: '2' }],
      }],
    })

    expect(goods[0]).toMatchObject({ goodsID: '42', brand: 'BOSCH', number: '100', count: 3, analogues: [] })
    expect(goods[0].warehouses[0]).toMatchObject({ id: '7', price: 199.5, stock: 2 })
  })

  it('handles the documented empty object response as no results', () => {
    expect(parseFavoritPayload({ goods: [{}] })).toEqual([])
  })

  it('rejects malformed goods instead of crashing the UI later', () => {
    expect(() => parseFavoritPayload({ goods: [{ brand: 123, number: '100' }] }))
      .toThrow('Сервис вернул некорректные данные')
  })

  it('surfaces errors returned by Favorit API', () => {
    expect(() => parseFavoritPayload({ error: ['Invalid key client!', 'Request quota exceeded!'] }))
      .toThrow('Invalid key client!. Request quota exceeded!')
  })
})
