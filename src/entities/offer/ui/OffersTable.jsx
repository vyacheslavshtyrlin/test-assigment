const priceFormatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 })

function OffersTable({ offers, brand, article }) {
  return (
    <section className="result-section offers-section" aria-labelledby="offers-title">
      <div className="section-heading offers-heading">
        <div>
          <span className="eyebrow">Результат</span>
          <h2 id="offers-title">Предложения и аналоги</h2>
        </div>
        <div className="query-summary"><span>{article}</span><i /> <span>{brand}</span></div>
      </div>
      <div className="table-shell table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead><tr><th>Деталь</th><th>Производитель</th><th>Склад</th><th>Остаток</th><th>Цена</th></tr></thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className={offer.stock === 0 ? 'muted-row' : ''}>
                <td data-label="Деталь">
                  <div className="part-cell">
                    <span className={offer.isAnalogue ? 'type-badge analogue' : 'type-badge original'}>{offer.isAnalogue ? 'Аналог' : 'Искомая'}</span>
                    <strong>{offer.name}</strong><small>{offer.number}</small>
                  </div>
                </td>
                <td data-label="Производитель"><strong className="table-brand">{offer.brand}</strong></td>
                <td data-label="Склад"><span className="warehouse">{offer.warehouse}</span>{offer.own ? <small className="own-label">свой склад</small> : null}</td>
                <td data-label="Остаток"><span className={`stock ${offer.stock > 0 ? 'in-stock' : 'out-stock'}`}><i />{offer.stock > 0 ? `${offer.stock} шт.` : 'Нет в наличии'}</span></td>
                <td data-label="Цена"><strong className="price">{offer.price === null ? '—' : priceFormatter.format(offer.price)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-note">Цены и остатки показаны отдельно для каждого склада</p>
    </section>
  )
}

export default OffersTable
