export const env = Object.freeze({
  apiPath: '/favorit-api',
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
  requestTimeoutMs: 8_000,
  requestAttempts: 2,
})

export const isDemoMode = env.useMockApi
