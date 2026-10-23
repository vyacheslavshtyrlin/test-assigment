import PartsSearchPage from '@/pages/parts-search/PartsSearchPage.jsx'
import { isDemoMode } from '@/shared/config/env.js'
import Header from '@/widgets/header/ui/Header.jsx'

export default function App() {
  return (
    <div className="app-shell d-flex flex-column">
      <Header isDemo={isDemoMode} />
      <PartsSearchPage />
      <footer className="mt-auto"><span>© 2026 Фаворит</span><span>Данные обновляются при каждом запросе</span></footer>
    </div>
  )
}
