import { describe, expect, it } from 'vitest'
import { buildSearch, parseSearchParams, sanitizeSearchValue } from './searchParams.js'

describe('search query parameters', () => {
  it('parses encoded number and brand', () => {
    expect(parseSearchParams('?number=W+914%2F2&brand=MANN-FILTER')).toEqual({
      number: 'W 914/2',
      brand: 'MANN-FILTER',
    })
  })

  it('does not accept brand without a part number', () => {
    expect(parseSearchParams('?brand=BOSCH')).toEqual({ number: '', brand: '' })
  })

  it('updates owned parameters and preserves unrelated ones', () => {
    const result = buildSearch('?utm_source=hh&number=old&brand=old', {
      number: 'W 914/2',
      brand: '',
    })
    expect(new URLSearchParams(result).get('utm_source')).toBe('hh')
    expect(new URLSearchParams(result).get('number')).toBe('W 914/2')
    expect(new URLSearchParams(result).has('brand')).toBe(false)
  })

  it('removes control characters and limits input length', () => {
    expect(sanitizeSearchValue(`  AB\u0000CD${'X'.repeat(100)}  `)).toBe(`ABCD${'X'.repeat(76)}`)
  })
})
