import { ArrowIcon } from '@/shared/ui/Icons.jsx'

export default function BrandList({ brands, selectedBrand, onSelect, article }) {
  return (
    <section className="result-section brand-section" aria-labelledby="brands-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Шаг 2</span>
          <h2 id="brands-title">Уточните производителя</h2>
        </div>
        <span className="result-count">{brands.length} {brands.length === 1 ? 'вариант' : 'варианта'}</span>
      </div>
      <p className="section-caption">Для артикула <strong>{article}</strong> найдены следующие бренды</p>
      <div className="brand-grid row g-3">
        {brands.map((item) => {
          const isSelected = item.brand === selectedBrand
          return (
            <div className="col-12 col-md-6 col-xl-4" key={item.brand}>
              <button
                className={`brand-card w-100 h-100 ${isSelected ? 'selected' : ''}`}
                type="button"
                onClick={() => onSelect(item.brand)}
                aria-pressed={isSelected}
              >
                <span className="brand-initial">{item.brand.charAt(0)}</span>
                <span className="brand-details"><strong>{item.brand}</strong><small>{item.name}</small></span>
                <span className="brand-arrow"><ArrowIcon /></span>
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
