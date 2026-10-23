import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearchParamsState } from './searchParams.js'

describe('useSearchParamsState', () => {
  beforeEach(() => window.history.replaceState(null, '', '/?number=100&utm_source=hh'))
  afterEach(() => window.history.replaceState(null, '', '/'))

  it('updates the URL and preserves unrelated query parameters', () => {
    const { result } = renderHook(() => useSearchParamsState())

    act(() => result.current.setValues({ number: '100', brand: 'BOSCH' }))

    expect(result.current).toMatchObject({ number: '100', brand: 'BOSCH' })
    expect(new URLSearchParams(window.location.search).get('utm_source')).toBe('hh')
  })

  it('does not create duplicate history entries for the same URL', () => {
    const pushState = vi.spyOn(window.history, 'pushState')
    const { result } = renderHook(() => useSearchParamsState())

    act(() => result.current.setValues({ number: '100', brand: '' }))

    expect(pushState).not.toHaveBeenCalled()
  })
})
