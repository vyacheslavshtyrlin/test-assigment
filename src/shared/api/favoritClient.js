import { env } from '../config/env.js'
import { mockSearchBrands, mockSearchOffers } from './mockFavoritAdapter.js'
import { parseFavoritPayload } from './favoritSchema.js'

const RETRYABLE_STATUS = new Set([502, 503, 504])

class NonRetryableRequestError extends Error {}

async function fetchWithTimeout(url, signal) {
  const controller = new AbortController()
  let didTimeout = false
  const abortFromCaller = () => controller.abort(signal?.reason)
  const timeoutId = window.setTimeout(() => {
    didTimeout = true
    controller.abort()
  }, env.requestTimeoutMs)

  if (signal?.aborted) abortFromCaller()
  else signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    return await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if (didTimeout) throw new DOMException('Request timed out', 'TimeoutError')
    throw error
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortFromCaller)
  }
}

async function requestRemote(params, signal) {
  const query = new URLSearchParams(params)

  for (let attempt = 1; attempt <= env.requestAttempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(`${env.apiPath}?${query}`, signal)
      const shouldRetry = RETRYABLE_STATUS.has(response.status) && attempt < env.requestAttempts
      if (shouldRetry) continue
      if (!response.ok) throw new NonRetryableRequestError(`Сервис ответил с ошибкой ${response.status}`)

      try {
        return parseFavoritPayload(await response.json())
      } catch (error) {
        const message = error instanceof SyntaxError
          ? 'Сервис вернул некорректный JSON.'
          : error.message
        throw new NonRetryableRequestError(message)
      }
    } catch (error) {
      if (signal?.aborted || error.name === 'AbortError') throw error
      if (error instanceof NonRetryableRequestError) throw new Error(error.message)
      if (attempt < env.requestAttempts && error.name !== 'TimeoutError') continue
      if (error.name === 'TimeoutError') throw new Error('Сервис не ответил вовремя. Попробуйте ещё раз.')
      throw new Error(error.message || 'Не удалось связаться с сервисом. Проверьте соединение.')
    }
  }

  throw new Error('Не удалось получить данные от сервиса.')
}

/**
 * Единственный внешний seam поиска. Внутри скрыты HTTP и mock-адаптеры,
 * кодирование параметров, отмена запросов и проверка ответа API.
 */
export function requestParts({ number, brand }, signal) {
  if (env.useMockApi) {
    return brand
      ? mockSearchOffers(number, brand, signal)
      : mockSearchBrands(number, signal)
  }

  const params = brand
    ? { number, brand, analogues: 'on' }
    : { number }

  return requestRemote(params, signal)
}
