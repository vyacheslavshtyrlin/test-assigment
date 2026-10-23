export function getUniqueBrands(goods) {
  const seen = new Set()

  return goods.reduce((brands, item) => {
    const normalized = item.brand.trim().toUpperCase()
    if (seen.has(normalized)) return brands

    seen.add(normalized)
    brands.push({
      brand: item.brand.trim(),
      name: item.name || 'Автозапчасть',
      number: item.number,
    })
    return brands
  }, [])
}

export function flattenOffers(goods) {
  const rows = []
  const seenRows = new Set()

  const pushUnique = (row) => {
    if (seenRows.has(row.id)) return
    seenRows.add(row.id)
    rows.push(row)
  }

  const appendItem = (item, isAnalogue) => {
    const warehouses = Array.isArray(item.warehouses) ? item.warehouses : []

    if (warehouses.length === 0) {
      pushUnique({
        id: `${isAnalogue ? 'analogue' : 'requested'}-${item.goodsID || item.brand}-${item.number}-none`,
        brand: item.brand,
        number: item.number,
        name: item.name || 'Без названия',
        price: null,
        stock: Number(item.count ?? 0),
        warehouse: '—',
        own: false,
        isAnalogue,
      })
      return
    }

    warehouses.forEach((warehouse, index) => {
      pushUnique({
        id: `${isAnalogue ? 'analogue' : 'requested'}-${item.goodsID || item.brand}-${item.number}-${warehouse.id || index}`,
        brand: item.brand,
        number: item.number,
        name: item.name || 'Без названия',
        price: Number.isFinite(Number(warehouse.price)) ? Number(warehouse.price) : null,
        stock: Number(warehouse.stock ?? 0),
        warehouse: warehouse.code || warehouse.id || 'Склад',
        own: Boolean(warehouse.own),
        isAnalogue,
      })
    })
  }

  goods.forEach((item) => {
    appendItem(item, false)
    const analogues = Array.isArray(item.analogues) ? item.analogues : []
    analogues.forEach((analogue) => appendItem(analogue, true))
  })

  return rows.sort((left, right) => {
    if (left.stock === 0 && right.stock > 0) return 1
    if (right.stock === 0 && left.stock > 0) return -1
    return (left.price ?? Infinity) - (right.price ?? Infinity)
  })
}
