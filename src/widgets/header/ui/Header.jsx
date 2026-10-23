function Header({ isDemo }) {
  return (
    <header className="site-header container-fluid d-flex align-items-center justify-content-between">
      <a className="brand-mark" href="/" aria-label="Фаворит — на главную">
        <span className="brand-symbol">F</span>
        <span className="brand-copy"><strong>ФАВОРИТ</strong><small>PARTS FINDER</small></span>
      </a>
      <div className="header-meta">
        {isDemo ? <span className="demo-badge badge rounded-pill"><i /> Демо-режим</span> : <span className="live-badge badge rounded-pill"><i /> API подключён</span>}
        <span className="catalog-label">Каталог запчастей</span>
      </div>
    </header>
  )
}

export default Header
