import { useCallback } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'
import { sanitizeSearchValue, useSearchParamsState } from '@/shared/lib/url/searchParams.js'
import { useGetBrandsQuery, useGetOffersQuery } from '../api/partsSearchApi.js'

const EMPTY_LIST = Object.freeze([])

function getErrorMessage(error, fallback) {
  return error?.message || error?.data?.message || fallback
}

export function usePartsSearch() {
  const { number, brand, setValues } = useSearchParamsState()

  const brandsQuery = useGetBrandsQuery(number || skipToken, {
    refetchOnMountOrArgChange: true,
  })

  const offersQuery = useGetOffersQuery(number && brand ? { number, brand } : skipToken, {
    refetchOnMountOrArgChange: true,
  })
  const brandsSucceeded = brandsQuery.isSuccess
  const offersSucceeded = offersQuery.isSuccess
  const refetchBrands = brandsQuery.refetch
  const refetchOffers = offersQuery.refetch

  const submitNumber = useCallback((rawNumber) => {
    const nextNumber = sanitizeSearchValue(rawNumber)
    if (!nextNumber) return

    setValues({ number: nextNumber, brand: '' })
    if (nextNumber === number && brandsSucceeded) refetchBrands()
  }, [brandsSucceeded, number, refetchBrands, setValues])

  const selectBrand = useCallback((nextBrand) => {
    if (!number) return
    const normalizedBrand = sanitizeSearchValue(nextBrand)
    if (normalizedBrand === brand && offersSucceeded) {
      refetchOffers()
      return
    }
    setValues({ number, brand: normalizedBrand })
  }, [brand, number, offersSucceeded, refetchOffers, setValues])

  return {
    query: { number, brand },
    brands: brandsQuery.currentData ?? EMPTY_LIST,
    offers: offersQuery.currentData ?? EMPTY_LIST,
    brandsState: {
      isLoading: brandsQuery.isLoading || brandsQuery.isFetching,
      isSuccess: brandsQuery.isSuccess,
      isError: brandsQuery.isError,
      error: getErrorMessage(brandsQuery.error, 'Не удалось выполнить поиск.'),
      retry: brandsQuery.refetch,
    },
    offersState: {
      isLoading: offersQuery.isLoading || offersQuery.isFetching,
      isSuccess: offersQuery.isSuccess,
      isError: offersQuery.isError,
      error: getErrorMessage(offersQuery.error, 'Не удалось загрузить предложения.'),
      retry: offersQuery.refetch,
    },
    currentStep: offersQuery.isSuccess ? 3 : brandsQuery.isSuccess ? 2 : 1,
    submitNumber,
    selectBrand,
  }
}
