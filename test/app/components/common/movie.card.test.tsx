// tests/components/movie.card.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { MovieResult } from '~/types'
import { MovieCard } from '~/components/common/movies.card'
import { movieComponentResponse } from '../features/main/main.features.test'

// --- helper to wrap in RemixStub ---
function withStub(ui: React.ReactNode) {
  const RemixStub = createRemixStub([{ path: '/', Component: () => <>{ui}</> }])
  return <RemixStub initialEntries={['/']} />
}

describe('MovieCard', () => {
  it('renders movie cards with poster images', () => {
    render(withStub(<MovieCard movies={movieComponentResponse.results} />))

    // Title
    expect(screen.getByText('War of the Worlds')).toBeInTheDocument()

    // Poster img
    const img = screen.getByAltText('War of the Worlds')
    expect(img).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w300/yvirUYrva23IudARHn3mMGVxWqM.jpg',
    )

    // Release year
    expect(screen.getByText('2025')).toBeInTheDocument()

    // Rating
    expect(screen.getByText(/⭐ 4.3/)).toBeInTheDocument()

    // Link
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/home/movie/755898',
    )
  })

  it('renders fallback when no poster', () => {
    render(
      withStub(
        <MovieCard
          movies={[{ ...movieComponentResponse.results[0], poster_path: '' }]}
        />,
      ),
    )

    // Fallback text
    expect(screen.getByText('No Image')).toBeInTheDocument()
  })

  it('uses custom baseUrl when provided', () => {
    render(
      withStub(
        <MovieCard
          movies={movieComponentResponse.results}
          baseUrl='/home/movie'
        />,
      ),
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/home/movie/755898')
  })
})
