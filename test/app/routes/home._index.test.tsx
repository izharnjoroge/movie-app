// tests/routes/home._index.test.tsx
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HomeIndex, { loader as homeIndexLoader } from '~/routes/home._index'
import * as api from '~/utils/apis/api'
import { Company, MovieResponse } from '~/types'

export const movieResponse: MovieResponse = {
  page: 1,
  total_pages: 2,
  total_results: 20,
  results: [
    {
      adult: false,
      backdrop_path: '/iZLqwEwUViJdSkGVjePGhxYzbDb.jpg',
      genre_ids: [878, 53],
      id: 755898,
      original_language: 'en',
      original_title: 'War of the Worlds',
      overview:
        'Will Radford is a top analyst for Homeland Security who tracks potential threats through a mass surveillance program, until one day an attack by an unknown entity leads him to question whether the government is hiding something from him... and from the rest of the world.',
      popularity: 1114.6291,
      poster_path: '/yvirUYrva23IudARHn3mMGVxWqM.jpg',
      release_date: '2025-07-29',
      title: 'War of the Worlds',
      video: false,
      vote_average: 4.311,
      vote_count: 446,
    },
  ],
}

export const company: Company = {
  description: '',
  headquarters: 'Burbank, California',
  homepage: 'https://movies.disney.com',
  id: 2,
  logo_path: '/wdrCwmRnLFJhEoH8GSfymY85KHT.png',
  name: 'Walt Disney Pictures',
  origin_country: 'US',
  parent_company: null,
}

// Stub feature components (not under test)
vi.mock('~/components/features/main/main.features', () => ({
  MainHero: ({ hero }: { hero: any[] }) => (
    <div>MainHero - {hero.length} items</div>
  ),
  StudioSliderComponent: ({ companies }: { companies: any[] }) => (
    <div>StudioSlider - {companies.length} companies</div>
  ),
  MovieRow: ({ title, items }: { title: string; items: any[] }) => (
    <div>
      {title} - {items.length} items
    </div>
  ),
}))

// STUDIOS is an array of ids
vi.mock('~/utils/constants/studios', () => ({
  STUDIOS: [{ id: '1' }, { id: '2' }],
}))

describe('HomeIndex route', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // Default API mocks
    vi.spyOn(api, 'getTrending').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getNowPlaying').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getPopular').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getTopRated').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getPopularTv').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getCompanyDetails').mockImplementation(async id => company)
  })

  function renderWithStub() {
    const RemixStub = createRemixStub([
      {
        path: '/home',
        Component: HomeIndex,
        loader: homeIndexLoader,
      },
    ])
    return render(<RemixStub initialEntries={['/home']} />)
  }

  it('renders all sections with data from loader', async () => {
    renderWithStub()

    // Hero
    expect(await screen.findByText(/MainHero - 1 items/i)).toBeInTheDocument()

    // Companies
    expect(
      await screen.findByText(/StudioSlider - 2 companies/i),
    ).toBeInTheDocument()

    // Movie Rows
    expect(
      await screen.findByText(/Just Released - 1 items/i),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/Popular This Week - 1 items/i),
    ).toBeInTheDocument()
    expect(await screen.findByText(/Top Rated - 1 items/i)).toBeInTheDocument()
    expect(
      await screen.findByText(/Top Rated Tv-Series - 1 items/i),
    ).toBeInTheDocument()
  })

  it('handles empty API responses gracefully', async () => {
    vi.spyOn(api, 'getTrending').mockResolvedValue({
      ...movieResponse,
      results: [],
    })
    vi.spyOn(api, 'getNowPlaying').mockResolvedValue({
      ...movieResponse,
      results: [],
    })
    vi.spyOn(api, 'getPopular').mockResolvedValue({
      ...movieResponse,
      results: [],
    })
    vi.spyOn(api, 'getTopRated').mockResolvedValue({
      ...movieResponse,
      results: [],
    })
    vi.spyOn(api, 'getPopularTv').mockResolvedValue({
      ...movieResponse,
      results: [],
    })
    vi.spyOn(api, 'getCompanyDetails').mockResolvedValue(null)

    renderWithStub()

    expect(await screen.findByText(/MainHero - 0 items/i)).toBeInTheDocument()
    expect(
      await screen.findByText(/StudioSlider - 2 companies/i),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/Just Released - 0 items/i),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/Popular This Week - 0 items/i),
    ).toBeInTheDocument()
  })
})
