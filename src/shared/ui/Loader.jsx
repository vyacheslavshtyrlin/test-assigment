function Loader({ label = 'Загружаем данные' }) {
  return (
    <div className="loader-panel" role="status" aria-live="polite">
      <span className="spinner-border text-danger" aria-hidden="true" />
      <strong>{label}</strong>
      <small>Это займёт несколько секунд</small>
    </div>
  )
}

export default Loader
