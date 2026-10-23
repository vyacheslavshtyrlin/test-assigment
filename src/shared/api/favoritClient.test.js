import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestParts } from './favoritClient.js'

vi.mock('../config/env.js', () => ({
  env: Object.freeze({
    apiPath: '/favorit-api',
    useMockApi: false,
    requestTimeoutMs: 8_000,
    requestAttempts: 2,
  }),
}))

const validPayload = {
  goods: [{ brand: 'BOSCH', number: '100', name: 'Фильтр', warehouses: [] }],
}

afterEach(() => vi.unstubAllGlobals())

describe('Favorit browser client', () => {
  it('sends only search parameters and never exposes the API key', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(validPayload), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await requestParts({ number: '100', brand: 'BOSCH' }, new AbortController().signal)

    const requestUrl = String(fetchMock.mock.calls[0][0])
    expect(requestUrl).toContain('number=100')
    expect(requestUrl).toContain('brand=BOSCH')
    expect(requestUrl).toContain('analogues=on')
    expect(requestUrl).not.toContain('key=')
  })

  it('retries a transient upstream failure once', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(validPayload), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(requestParts({ number: '100' }, new AbortController().signal)).resolves.toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry a non-transient client error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 401 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(requestParts({ number: '100' }, new AbortController().signal)).rejects.toThrow('401')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
