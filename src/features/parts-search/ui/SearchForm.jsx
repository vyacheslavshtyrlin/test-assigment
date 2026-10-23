import { useRef, useState } from 'react'
import { SearchIcon } from '@/shared/ui/Icons.jsx'

export default function SearchForm({ initialValue = '', onSubmit, isLoading }) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!value.trim()) {
      setError('Введите артикул детали')
      inputRef.current?.focus()
      return
    }

    setError('')
    onSubmit(value)
  }

  const handleChange = (event) => {
    const nextValue = event.target.value
    setValue(nextValue)
    if (error && nextValue.trim()) setError('')
  }

  return (
    <form className={`search-form ${error ? 'has-error' : ''}`} onSubmit={handleSubmit} noValidate>
      <label className="form-label" htmlFor="article">Артикул детали</label>
      <div className="search-control input-group input-group-lg">
        <span className="search-icon input-group-text"><SearchIcon /></span>
        <input
          ref={inputRef}
          className="form-control"
          id="article"
          value={value}
          onChange={handleChange}
          placeholder="Например, W 914/2"
          autoComplete="off"
          autoFocus
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'search-hint search-error' : 'search-hint'}
        />
        <button className="btn btn-danger" type="submit" disabled={isLoading}>
          {isLoading ? <><span className="button-spinner" /> Ищем</> : 'Найти'}
        </button>
      </div>
      <p className="form-text" id="search-hint">Введите номер без лишних пробелов — дефисы и спецсимволы допустимы</p>
      {error ? <p className="search-error" id="search-error" role="alert">{error}</p> : null}
    </form>
  )
}
