import { createApi } from '@reduxjs/toolkit/query/react'
import { flattenOffers, getUniqueBrands } from '@/entities/offer/lib/normalizeGoods.js'
import { requestParts } from '@/shared/api/favoritClient.js'

async function favoritBaseQuery(args, { signal }) {
  try {
    return { data: await requestParts(args, signal) }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { error: { status: 'ABORTED', message: 'Запрос отменён' } }
    }

    return {
      error: {
        status: 'CUSTOM_ERROR',
        message: error.message || 'Неизвестная ошибка сервиса',
      },
    }
  }
}

export const partsSearchApi = createApi({
  reducerPath: 'partsSearchApi',
  baseQuery: favoritBaseQuery,
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (number) => ({ number }),
      transformResponse: getUniqueBrands,
    }),
    getOffers: builder.query({
      query: ({ number, brand }) => ({ number, brand }),
      transformResponse: flattenOffers,
    }),
  }),
})

export const { useGetBrandsQuery, useGetOffersQuery } = partsSearchApi
