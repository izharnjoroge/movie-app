// tests/components/main.features.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'

import {
  MovieRow,
  CompanyRow,
  MainHero,
  StudioSliderComponent,
} from '~/components/features/main/main.features'
import { Company, MovieResponse } from '~/types'

export const movieComponentResponse: MovieResponse = {
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

export const companyComponentResponse: Company = {
  description: '',
  headquarters: 'Burbank, California',
  homepage: 'https://movies.disney.com',
  id: 2,
  logo_path: '/wdrCwmRnLFJhEoH8GSfymY85KHT.png',
  name: 'Walt Disney Pictures',
  origin_country: 'US',
  parent_company: null,
}

// --- mock child components so we only test rendering logic ---
vi.mock('~/components/common/carousel', () => ({
  ManualCarousel: ({ items, renderItem }: any) => (
    <div data-testid='carousel'>
      {items.map((item: any, i: number) => (
        <div key={i}>{renderItem(item)}</div>
      ))}
    </div>
  ),
}))

vi.mock('~/components/common/slider', () => ({
  default: ({ children }: any) => <div data-testid='slider'>{children}</div>,
}))

// --- helper to wrap components with RemixStub ---
function withStub(ui: React.ReactNode) {
  const RemixStub = createRemixStub([{ path: '/', Component: () => <>{ui}</> }])
  return <RemixStub initialEntries={['/']} />
}

describe('MovieRow', () => {
  it('renders nothing when items is empty', () => {
    render(withStub(<MovieRow title='Popular' items={[]} />))
    expect(screen.queryByText('Popular')).toBeNull()
  })

  it('renders movies with poster and fallback when missing', () => {
    render(
      withStub(
        <MovieRow title='Trending' items={movieComponentResponse.results} />,
      ),
    )
    expect(screen.getByText('Trending')).toBeInTheDocument()

    expect(screen.getByText('⭐ 4.3')).toBeInTheDocument()
  })
})

describe('CompanyRow', () => {
  it('renders null when no company', () => {
    const { container } = render(withStub(<CompanyRow company={null} />))
    expect(container.firstChild).toBeNull()
  })

  it('renders company with logo and name', () => {
    render(withStub(<CompanyRow company={companyComponentResponse} />))

    expect(screen.getByText('Walt Disney Pictures')).toBeInTheDocument()
  })
})

describe('MainHero', () => {
  it('renders hero carousel with backdrop and content', async () => {
    render(withStub(<MainHero hero={movieComponentResponse.results} />))

    expect(screen.getByRole('link', { name: /View Details/i })).toHaveAttribute(
      'href',
      '/home/movie/755898',
    )
  })
})

describe('StudioSliderComponent', () => {
  it('renders slider on desktop', async () => {
    render(
      withStub(
        <StudioSliderComponent companies={[companyComponentResponse]} />,
      ),
    )
    expect(screen.getByText('Studios')).toBeInTheDocument()
    expect(screen.getByTestId('slider')).toBeInTheDocument()
    const companies = await screen.findAllByText('Walt Disney Pictures')
    expect(companies.length).toBeGreaterThan(0)
  })
})
