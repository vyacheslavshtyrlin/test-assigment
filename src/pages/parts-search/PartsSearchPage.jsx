import OffersTable from '@/entities/offer/ui/OffersTable.jsx'
import { usePartsSearch } from '@/features/parts-search/model/usePartsSearch.js'
import BrandList from '@/features/parts-search/ui/BrandList.jsx'
import SearchForm from '@/features/parts-search/ui/SearchForm.jsx'
import Stepper from '@/features/parts-search/ui/Stepper.jsx'
import Loader from '@/shared/ui/Loader.jsx'
import StateMessage from '@/shared/ui/StateMessage.jsx'

export default function PartsSearchPage() {
  const search = usePartsSearch()
  const { number, brand } = search.query

  return (
    <main className="container-xxl">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Умный поиск по каталогу</span>
          <h1>Найдите нужную<br /><em>деталь.</em></h1>
          <p>Оригиналы и совместимые аналоги — с актуальными ценами и остатками на складах.</p>
        </div>
        <div className="hero-index" aria-hidden="true"><span>01</span><small>/ 03</small></div>
      </section>

      <div className="search-panel">
        <SearchForm
          key={number}
          initialValue={number}
          onSubmit={search.submitNumber}
          isLoading={search.brandsState.isLoading}
        />
        <Stepper currentStep={search.currentStep} />
      </div>

      <div className="results-area" aria-live="polite">
        {search.brandsState.isLoading ? <Loader label="Ищем производителей" /> : null}
        {search.brandsState.isError ? <StateMessage type="error" title="Поиск не выполнен" message={search.brandsState.error} onRetry={search.brandsState.retry} /> : null}
        {search.brandsState.isSuccess && search.brands.length === 0 ? <StateMessage title="Ничего не найдено" message="Проверьте артикул или попробуйте другой номер детали." /> : null}
        {search.brands.length > 0 ? <BrandList brands={search.brands} selectedBrand={brand} onSelect={search.selectBrand} article={number} /> : null}
        {search.offersState.isLoading ? <Loader label="Собираем предложения и аналоги" /> : null}
        {search.offersState.isError ? <StateMessage type="error" title="Предложения не загрузились" message={search.offersState.error} onRetry={search.offersState.retry} /> : null}
        {search.offersState.isSuccess && search.offers.length === 0 ? <StateMessage title="Предложений пока нет" message="Для выбранного производителя не найдено доступных предложений." /> : null}
        {search.offers.length > 0 ? <OffersTable offers={search.offers} brand={brand} article={number} /> : null}
      </div>
    </main>
  )
}
