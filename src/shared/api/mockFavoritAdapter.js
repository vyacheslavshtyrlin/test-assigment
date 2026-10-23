function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const cleanup = () => signal?.removeEventListener('abort', handleAbort)
    const handleResolve = () => {
      cleanup()
      resolve()
    }
    const handleAbort = () => {
      window.clearTimeout(timeoutId)
      cleanup()
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const timeoutId = window.setTimeout(handleResolve, ms)

    if (signal?.aborted) handleAbort()
    else signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

const CATALOG = [
  {
    goodsID: 'fav-001', brand: 'MANN-FILTER', number: 'W 914/2', name: 'Фильтр масляный', count: 34,
    warehouses: [
      { code: 'ЕКБ', id: 'wh-1', own: true, price: 890, stock: 12, shipmentDate: '2026-10-24T16:00:00' },
      { code: 'МСК', id: 'wh-2', own: false, price: 835, stock: 22, shipmentDate: '2026-10-26T14:00:00' },
    ],
    analogues: [
      { goodsID: 'fav-002', brand: 'MAHLE', number: 'OC 47', name: 'Фильтр масляный', count: 8, warehouses: [{ code: 'ЕКБ', id: 'wh-1', own: true, price: 760, stock: 8 }] },
      { goodsID: 'fav-003', brand: 'BOSCH', number: '0 451 103 033', name: 'Масляный фильтр', count: 17, warehouses: [{ code: 'СПБ', id: 'wh-3', own: false, price: 710, stock: 17 }] },
      { goodsID: 'fav-004', brand: 'FILTRON', number: 'OP 520/1', name: 'Фильтр масляный', count: 0, warehouses: [] },
    ],
  },
  {
    goodsID: 'fav-005', brand: 'SAKURA', number: 'C-1104', name: 'Фильтр масляный', count: 9,
    warehouses: [{ code: 'МСК', id: 'wh-2', own: false, price: 645, stock: 9 }], analogues: [],
  },
  {
    goodsID: 'fav-006', brand: 'LYNXAUTO', number: 'LC-1701', name: 'Фильтр масляный', count: 5,
    warehouses: [{ code: 'ЕКБ', id: 'wh-1', own: true, price: 520, stock: 5 }], analogues: [],
  },
]

export async function mockSearchBrands(number, signal) {
  await wait(650, signal)
  if (number.toLowerCase() === 'error') throw new Error('Сервис временно недоступен. Попробуйте ещё раз.')
  if (number.toLowerCase() === 'empty') return []
  return CATALOG
}

export async function mockSearchOffers(number, brand, signal) {
  await wait(800, signal)
  const selected = CATALOG.find((item) => item.brand === brand)
  return selected ? [{ ...selected, number }] : []
}
