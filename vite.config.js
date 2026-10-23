import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useMockApi = env.VITE_USE_MOCK_API !== 'false'
  const apiKey = env.FAVORIT_API_KEY?.trim()

  if (command === 'serve' && mode !== 'test' && !useMockApi && !apiKey) {
    throw new Error('FAVORIT_API_KEY is required when VITE_USE_MOCK_API=false')
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: useMockApi ? undefined : {
        '/favorit-api': {
          target: 'http://api.favorit-parts.ru',
          changeOrigin: true,
          rewrite: (path) => {
            const requestUrl = new URL(path, 'http://vite.local')
            requestUrl.pathname = '/hs/hsprice/'
            requestUrl.searchParams.set('key', apiKey)
            return `${requestUrl.pathname}?${requestUrl.searchParams}`
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      clearMocks: true,
    },
  }
})
