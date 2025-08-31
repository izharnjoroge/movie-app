// tests/routes/movies.test.tsx
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MoviesPage, {
  loader as moviesLoader,
  action as moviesAction,
} from '~/routes/home.movies'
import * as api from '~/utils/apis/api'
import { movieResponse } from './home._index.test'

// --- stub child components ---
vi.mock('~/components/common/section.wrapper', () => ({
  SectionWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='section'>{children}</div>
  ),
}))
vi.mock('~/components/common/search', () => ({
  SearchForm: () => <div>SearchForm</div>,
}))
vi.mock('~/components/common/movies.card', () => ({
  MovieCard: ({ movies }: { movies: any[] }) => (
    <div>MovieCard - {movies.length} items</div>
  ),
}))
vi.mock('~/components/common/pagination', () => ({
  PaginationComponent: ({
    page,
    totalPages,
  }: {
    page: number
    totalPages: number
  }) => (
    <div>
      Pagination - page {page} of {totalPages}
    </div>
  ),
}))

describe('movies route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(api, 'getPopular').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'searchMovies').mockResolvedValue(movieResponse)
  })

  function renderWithStub(initialPath = '/home/movies') {
    const RemixStub = createRemixStub([
      {
        path: '/home/movies',
        Component: MoviesPage,
        loader: moviesLoader,
        action: moviesAction,
      },
    ])
    return render(<RemixStub initialEntries={[initialPath]} />)
  }

  it('loads and renders popular movies by default', async () => {
    renderWithStub()

    expect(await screen.findByText('🎥 Movies Directory')).toBeInTheDocument()
    expect(await screen.findByText('SearchForm')).toBeInTheDocument()
    expect(await screen.findByText(/MovieCard - 1 items/)).toBeInTheDocument()
    expect(
      await screen.findByText(/Pagination - page 1 of 2/),
    ).toBeInTheDocument()
  })

  it('loads and renders search results if query param is provided', async () => {
    renderWithStub('/home/movies?query=matrix&page=2')

    expect(await screen.findByText(/MovieCard - 1 items/)).toBeInTheDocument()
    expect(
      await screen.findByText(/Pagination - page 2 of 2/),
    ).toBeInTheDocument()
  })

  describe('action()', () => {
    it('redirects to movies page if query is missing', async () => {
      const req = new Request('http://localhost/home/movies', {
        method: 'POST',
        body: new URLSearchParams({ query: '' }),
      })
      const res = (await moviesAction({ request: req } as any)) as Response
      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('/home/movies')
    })

    it('redirects with query param when valid', async () => {
      const req = new Request('http://localhost/home/movies', {
        method: 'POST',
        body: new URLSearchParams({ query: 'avatar' }),
      })
      const res = (await moviesAction({ request: req } as any)) as Response
      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe(
        '/home/movies?query=avatar&page=1',
      )
    })
  })
})
