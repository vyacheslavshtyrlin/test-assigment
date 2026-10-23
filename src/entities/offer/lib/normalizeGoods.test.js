import { describe, expect, it } from 'vitest'
import { flattenOffers, getUniqueBrands } from './normalizeGoods.js'

describe('offer normalization', () => {
  it('deduplicates brands ignoring case', () => {
    const goods = [
      { brand: 'Bosch', number: '1', name: 'A' },
      { brand: 'BOSCH', number: '1', name: 'B' },
      { brand: 'MANN', number: '1', name: 'C' },
    ]
    expect(getUniqueBrands(goods).map((item) => item.brand)).toEqual(['Bosch', 'MANN'])
  })

  it('uses warehouse prices, adds analogues and sorts available offers by price', () => {
    const goods = [{
      goodsID: '1', brand: 'A', number: '100', name: 'Original', price: 9999,
      warehouses: [{ id: 'w1', code: 'ЕКБ', price: 500, stock: 2 }],
      analogues: [{ goodsID: '2', brand: 'B', number: '200', name: 'Analogue', warehouses: [{ id: 'w2', price: 300, stock: 1 }] }],
    }]
    const offers = flattenOffers(goods)
    expect(offers).toHaveLength(2)
    expect(offers[0]).toMatchObject({ price: 300, isAnalogue: true })
    expect(offers[1]).toMatchObject({ price: 500, isAnalogue: false })
  })

  it('keeps unavailable goods without warehouses', () => {
    const offers = flattenOffers([{ goodsID: '1', brand: 'A', number: '100', warehouses: [], count: 0 }])
    expect(offers[0]).toMatchObject({ price: null, stock: 0, warehouse: '—' })
  })

  it('removes duplicate warehouse offers returned by the upstream service', () => {
    const duplicate = { goodsID: '2', brand: 'B', number: '200', warehouses: [{ id: 'w2', price: 300, stock: 1 }] }
    const offers = flattenOffers([{ goodsID: '1', brand: 'A', number: '100', warehouses: [], analogues: [duplicate, duplicate] }])
    expect(offers.filter((offer) => offer.brand === 'B')).toHaveLength(1)
  })
})
