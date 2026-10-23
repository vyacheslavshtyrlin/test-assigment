import { useCallback, useSyncExternalStore } from 'react'

export const SEARCH_PARAM_KEYS = Object.freeze({
  number: 'number',
  brand: 'brand',
})

const URL_CHANGE_EVENT = 'favorit:urlchange'
const MAX_QUERY_VALUE_LENGTH = 80

export function sanitizeSearchValue(value) {
  if (typeof value !== 'string') return ''
  const printableValue = Array.from(value, (character) => {
    const code = character.charCodeAt(0)
    return code >= 32 && code !== 127 ? character : ''
  }).join('')

  return printableValue.trim().slice(0, MAX_QUERY_VALUE_LENGTH)
}

export function parseSearchParams(search) {
  const params = new URLSearchParams(search)
  const number = sanitizeSearchValue(params.get(SEARCH_PARAM_KEYS.number) || '')
  const brand = number ? sanitizeSearchValue(params.get(SEARCH_PARAM_KEYS.brand) || '') : ''
  return { number, brand }
}

export function buildSearch(search, nextValues) {
  const params = new URLSearchParams(search)
  const number = sanitizeSearchValue(nextValues.number ?? params.get(SEARCH_PARAM_KEYS.number) ?? '')
  const brand = number
    ? sanitizeSearchValue(nextValues.brand ?? params.get(SEARCH_PARAM_KEYS.brand) ?? '')
    : ''

  if (number) params.set(SEARCH_PARAM_KEYS.number, number)
  else params.delete(SEARCH_PARAM_KEYS.number)

  if (brand) params.set(SEARCH_PARAM_KEYS.brand, brand)
  else params.delete(SEARCH_PARAM_KEYS.brand)

  return params.toString()
}

function subscribeToLocation(onStoreChange) {
  window.addEventListener('popstate', onStoreChange)
  window.addEventListener(URL_CHANGE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener('popstate', onStoreChange)
    window.removeEventListener(URL_CHANGE_EVENT, onStoreChange)
  }
}

const getLocationSnapshot = () => window.location.search
const getServerSnapshot = () => ''

export function useSearchParamsState() {
  const search = useSyncExternalStore(subscribeToLocation, getLocationSnapshot, getServerSnapshot)
  const values = parseSearchParams(search)

  const setValues = useCallback((nextValues, options = {}) => {
    const nextSearch = buildSearch(window.location.search, nextValues)
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
    if (nextUrl === currentUrl) return
    const method = options.replace ? 'replaceState' : 'pushState'

    window.history[method](null, '', nextUrl)
    window.dispatchEvent(new Event(URL_CHANGE_EVENT))
  }, [])

  return { ...values, setValues }
}
