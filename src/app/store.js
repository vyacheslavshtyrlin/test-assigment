import { configureStore } from '@reduxjs/toolkit'
import { partsSearchApi } from '@/features/parts-search/api/partsSearchApi.js'

export const store = configureStore({
  reducer: {
    [partsSearchApi.reducerPath]: partsSearchApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(partsSearchApi.middleware),
})
