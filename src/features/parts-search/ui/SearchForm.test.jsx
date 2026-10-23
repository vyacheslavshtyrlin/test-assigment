import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SearchForm from './SearchForm.jsx'

describe('SearchForm', () => {
  it('keeps draft local and submits the entered article', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SearchForm onSubmit={onSubmit} />)

    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: 'Найти' })
    expect(button).toBeEnabled()

    await user.type(input, 'W 914/2')
    await user.click(button)

    expect(onSubmit).toHaveBeenCalledWith('W 914/2')
  })

  it('keeps the form interactive and explains an empty submission', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SearchForm onSubmit={onSubmit} />)

    const input = screen.getByRole('textbox')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('Введите артикул детали')
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables submission while a request is in progress', () => {
    render(<SearchForm initialValue="100" onSubmit={vi.fn()} isLoading />)
    expect(screen.getByRole('button', { name: /Ищем/ })).toBeDisabled()
  })
})
