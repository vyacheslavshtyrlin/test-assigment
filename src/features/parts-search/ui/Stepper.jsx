function Stepper({ currentStep }) {
  return (
    <ol className="stepper" aria-label="Этапы поиска">
      <li className={currentStep >= 1 ? 'active' : ''}>
        <span>01</span><div><strong>Артикул</strong><small>Номер детали</small></div>
      </li>
      <li className={currentStep >= 2 ? 'active' : ''}>
        <span>02</span><div><strong>Производитель</strong><small>Выбор бренда</small></div>
      </li>
      <li className={currentStep >= 3 ? 'active' : ''}>
        <span>03</span><div><strong>Предложения</strong><small>Цена и наличие</small></div>
      </li>
    </ol>
  )
}

export default Stepper
