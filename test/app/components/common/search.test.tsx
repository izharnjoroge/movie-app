// tests/components/search.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { SearchForm } from '~/components/common/search'

// Mock navigate from remix
const mockNavigate = vi.fn()
vi.mock('@remix-run/react', async importOriginal => {
  const actual: any = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// --- helper wrapper ---
function withStub(ui: React.ReactNode) {
  const RemixStub = createRemixStub([{ path: '/', Component: () => <>{ui}</> }])
  return <RemixStub initialEntries={['/']} />
}

describe('SearchForm', () => {
  it('renders with default placeholder', () => {
    render(withStub(<SearchForm />))

    const input = screen.getByPlaceholderText('Search movies...')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'query')
  })

  it('renders with custom placeholder', () => {
    render(withStub(<SearchForm placeholder='Find shows...' />))

    expect(screen.getByPlaceholderText('Find shows...')).toBeInTheDocument()
  })

  it('renders submit and clear buttons', () => {
    render(withStub(<SearchForm />))

    const submitBtn = screen.getByRole('button', { name: /search/i })
    expect(submitBtn).toHaveAttribute('type', 'submit')

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('clears input and navigates to baseUrl on clear click', () => {
    render(withStub(<SearchForm baseUrl='/home/movies' />))

    const input = screen.getByPlaceholderText(
      'Search movies...',
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Inception' } })
    expect(input.value).toBe('Inception')

    const clearBtn = screen.getAllByRole('button')[1]
    fireEvent.click(clearBtn)

    expect(input.value).toBe('') // cleared
    expect(mockNavigate).toHaveBeenCalledWith('/home/movies')
  })

  it('respects custom baseUrl when clearing', () => {
    render(withStub(<SearchForm baseUrl='/discover' />))

    const clearBtn = screen.getAllByRole('button')[1]
    fireEvent.click(clearBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/discover')
  })
})
