// tests/components/pagination.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { PaginationComponent } from '~/components/common/pagination'

// --- helper wrapper ---
function withStub(ui: React.ReactNode) {
  const RemixStub = createRemixStub([{ path: '/', Component: () => <>{ui}</> }])
  return <RemixStub initialEntries={['/']} />
}

describe('PaginationComponent', () => {
  it('disables Prev button on first page', () => {
    render(
      withStub(
        <PaginationComponent page={1} totalPages={5} basePath='/home/movies' />,
      ),
    )

    const prev = screen.getByText(/Prev/i)
    expect(prev).toHaveAttribute('aria-disabled', 'true')
    expect(prev).toHaveAttribute('href', '/')

    const next = screen.getByText(/Next/i)
    expect(next).toHaveAttribute('href', '/home/movies?page=2')
  })

  it('disables Next button on last page', () => {
    render(
      withStub(
        <PaginationComponent page={5} totalPages={5} basePath='/home/movies' />,
      ),
    )

    const next = screen.getByText(/Next/i)
    expect(next).toHaveAttribute('aria-disabled', 'true')
    expect(next).toHaveAttribute('href', '/')

    const prev = screen.getByText(/Prev/i)
    expect(prev).toHaveAttribute('href', '/home/movies?page=4')
  })

  it('renders both Prev and Next links when in middle pages', () => {
    render(
      withStub(
        <PaginationComponent page={3} totalPages={5} basePath='/home/movies' />,
      ),
    )

    const prev = screen.getByText(/Prev/i)
    const next = screen.getByText(/Next/i)

    expect(prev).toHaveAttribute('href', '/home/movies?page=2')
    expect(next).toHaveAttribute('href', '/home/movies?page=4')
  })

  it('appends ?page when no query string exists', () => {
    render(
      withStub(
        <PaginationComponent page={2} totalPages={3} basePath='/home/movies' />,
      ),
    )

    expect(screen.getByText(/Prev/i)).toHaveAttribute(
      'href',
      '/home/movies?page=1',
    )
    expect(screen.getByText(/Next/i)).toHaveAttribute(
      'href',
      '/home/movies?page=3',
    )
  })

  it('appends &page when basePath already has query string', () => {
    render(
      withStub(
        <PaginationComponent
          page={2}
          totalPages={3}
          basePath='/home/movies?sort=popular'
        />,
      ),
    )

    expect(screen.getByText(/Prev/i)).toHaveAttribute(
      'href',
      '/home/movies?sort=popular&page=1',
    )
    expect(screen.getByText(/Next/i)).toHaveAttribute(
      'href',
      '/home/movies?sort=popular&page=3',
    )
  })
})
