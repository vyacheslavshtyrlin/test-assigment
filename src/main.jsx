import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from '@/app/App.jsx'
import { store } from '@/app/store.js'
import AppErrorBoundary from '@/shared/ui/AppErrorBoundary.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </Provider>
  </StrictMode>,
)
