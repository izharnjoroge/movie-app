// tests/components/movie.hero.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import * as remix from '@remix-run/react'
import { MovieHero } from '~/components/common/movie.hero'
import { IndividualMovieDetails, MovieTrailers } from '~/types'

// --- mocks ---
export const detailsComponent: IndividualMovieDetails = {
  adult: false,
  backdrop_path: '/ZtcGMc204JsNqfjS9lU6udRgpo.jpg',
  belongs_to_collection: null,
  budget: 250000000,
  genres: [
    {
      id: 28,
      name: 'Action',
    },
    {
      id: 18,
      name: 'Drama',
    },
  ],
  homepage: 'https://www.f1themovie.com',
  id: 911430,
  imdb_id: 'tt16311594',
  origin_country: ['US'],
  original_language: 'en',
  original_title: 'F1',
  overview:
    'Racing legend Sonny Hayes is coaxed out of retirement to lead a struggling Formula 1 team—and mentor a young hotshot driver—while chasing one more chance at glory.',
  popularity: 829.4888,
  poster_path: '/9PXZIUsSDh4alB80jheWX4fhZmy.jpg',
  production_companies: [
    {
      id: 81,
      logo_path: '/8wOfUhA7vwU2gbPjQy7Vv3EiF0o.png',
      name: 'Plan B Entertainment',
      origin_country: 'US',
    },
    {
      id: 130,
      logo_path: '/c9dVHPOL3cqCr2593Ahk0nEKTEM.png',
      name: 'Jerry Bruckheimer Films',
      origin_country: 'US',
    },
    {
      id: 199632,

      name: 'Dawn Apollo Films',
      origin_country: 'US',
    },
    {
      id: 194232,
      logo_path: '/oE7H93u8sy5vvW5EH3fpCp68vvB.png',
      name: 'Apple Studios',
      origin_country: 'US',
    },
    {
      id: 19647,

      name: 'Monolith Pictures',
      origin_country: 'US',
    },
  ],
  production_countries: [
    {
      iso_3166_1: 'US',
      name: 'United States of America',
    },
  ],
  release_date: '2025-06-25',
  revenue: 607126203,
  runtime: 156,
  spoken_languages: [
    {
      english_name: 'English',
      iso_639_1: 'en',
      name: 'English',
    },
  ],
  status: 'Released',
  tagline: 'This is just the start.',
  title: 'F1',
  video: false,
  vote_average: 7.806,
  vote_count: 1651,
}

export const trailerComponent: MovieTrailers = {
  id: 911480,
  results: [
    {
      iso_639_1: 'en',
      iso_3166_1: 'US',
      name: 'Buy It Now on Digital',
      key: 'mbCDMwmiGng',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2025-07-01T21:01:00.000Z',
      id: '686484beb746ffb2a88c265a',
    },
  ],
}

// Mock remix so we can override useNavigation
vi.mock('@remix-run/react', async importOriginal => {
  const actual: any = await importOriginal()
  return {
    ...actual,
    useNavigation: vi.fn(() => ({ state: 'idle' })), // default
  }
})

// --- helper to wrap in RemixStub ---
function withStub(ui: React.ReactNode) {
  const RemixStub = createRemixStub([{ path: '/', Component: () => <>{ui}</> }])
  return <RemixStub initialEntries={['/']} />
}

describe('MovieHero', () => {
  it('renders nothing if details is null', () => {
    const { container } = render(
      withStub(<MovieHero details={null} trailer={undefined} />),
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders movie details correctly', () => {
    render(
      withStub(<MovieHero details={detailsComponent} trailer={undefined} />),
    )

    expect(screen.getByText('F1')).toBeInTheDocument()
    expect(screen.getByAltText('F1')).toHaveAttribute(
      'src',
      expect.stringContaining(
        'https://image.tmdb.org/t/p/w300/9PXZIUsSDh4alB80jheWX4fhZmy.jpg',
      ),
    )
  })

  it('renders trailer link when provided', () => {
    render(
      withStub(
        <MovieHero
          details={detailsComponent}
          trailer={trailerComponent.results[0]}
        />,
      ),
    )

    const link = screen.getByRole('link', { name: /Trailer/i })
    expect(link).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=mbCDMwmiGng',
    )
  })

  it('renders forms with correct hidden inputs', () => {
    render(
      withStub(<MovieHero details={detailsComponent} trailer={undefined} />),
    )

    // Favorites button
    expect(screen.getByRole('button', { name: /Fav/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Watch/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Rate/i })).toBeInTheDocument()

    // Hidden inputs check
    const hiddenInputs = screen.getAllByDisplayValue('movie')
    expect(hiddenInputs.length).toBeGreaterThan(0)
  })
})
