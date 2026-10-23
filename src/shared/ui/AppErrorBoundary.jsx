import { Component } from 'react'

export default class AppErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) console.error('Unhandled application error', error, errorInfo)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="fatal-error" role="alert">
        <span>Что-то пошло не так</span>
        <h1>Не удалось открыть приложение</h1>
        <p>Обновите страницу. Если ошибка повторится, попробуйте вернуться позже.</p>
        <button type="button" onClick={() => window.location.reload()}>Обновить страницу</button>
      </main>
    )
  }
}
