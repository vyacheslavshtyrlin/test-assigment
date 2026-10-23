import { z } from 'zod'

const optionalNumber = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : value
}, z.number().finite().optional())

const optionalIdentifier = z.union([z.string(), z.number()]).transform(String).optional()

const warehouseSchema = z.object({
  code: z.string().optional(),
  id: optionalIdentifier,
  own: z.boolean().optional().default(false),
  shipmentDate: z.string().optional(),
  price: optionalNumber,
  stock: optionalNumber.default(0),
  notRefund: z.boolean().optional(),
}).passthrough()

const baseGoodsSchema = z.object({
  goodsID: optionalIdentifier,
  brand: z.string().trim().min(1),
  number: z.string().trim().min(1),
  name: z.string().optional().default(''),
  count: optionalNumber.default(0),
  rate: optionalNumber,
  warehouses: z.array(warehouseSchema).optional().default([]),
  notRefund: z.boolean().optional(),
}).passthrough()

const goodsSchema = baseGoodsSchema.extend({
  analogues: z.array(baseGoodsSchema).optional().default([]),
})

export function parseFavoritPayload(payload) {
  if (payload?.error) {
    const details = Array.isArray(payload.error) ? payload.error.join('. ') : payload.error
    throw new Error(String(details || 'API вернул ошибку'))
  }

  const rawGoods = Array.isArray(payload) ? payload : payload?.goods
  if (!Array.isArray(rawGoods)) throw new Error('Сервис вернул данные неизвестного формата.')

  const nonEmptyGoods = rawGoods.filter((item) => item && typeof item === 'object' && Object.keys(item).length > 0)
  const result = z.array(goodsSchema).safeParse(nonEmptyGoods)

  if (!result.success) throw new Error('Сервис вернул некорректные данные о товарах.')
  return result.data
}
