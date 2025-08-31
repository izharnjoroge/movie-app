// tests/routes/home.tvs.test.tsx
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TvPage, {
  loader as tvsLoader,
  action as tvsAction,
} from '~/routes/home.tvs'
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

describe('home.tvs route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(api, 'getPopularTv').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'searchTvs').mockResolvedValue(movieResponse)
  })

  function renderWithStub(initialPath = '/home/tvs') {
    const RemixStub = createRemixStub([
      {
        path: '/home/tvs',
        Component: TvPage,
        loader: tvsLoader,
        action: tvsAction,
      },
    ])
    return render(<RemixStub initialEntries={[initialPath]} />)
  }

  it('loads and renders popular tv shows by default', async () => {
    renderWithStub()

    expect(
      await screen.findByText('📺 TV Series Directory'),
    ).toBeInTheDocument()
    expect(await screen.findByText('SearchForm')).toBeInTheDocument()
    expect(await screen.findByText(/MovieCard - 1 items/)).toBeInTheDocument()
    expect(
      await screen.findByText(/Pagination - page 1 of 2/),
    ).toBeInTheDocument()
  })

  it('loads and renders search results if query param is provided', async () => {
    renderWithStub('/home/tvs?query=test&page=2')

    expect(await screen.findByText(/MovieCard - 1 items/)).toBeInTheDocument()
    expect(
      await screen.findByText(/Pagination - page 2 of 2/),
    ).toBeInTheDocument()
  })

  describe('action()', () => {
    it('redirects to tvs page if query is missing', async () => {
      const req = new Request('http://localhost/home/tvs', {
        method: 'POST',
        body: new URLSearchParams({ query: '' }),
      })
      const res = (await tvsAction({ request: req } as any)) as Response
      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('/home/tvs')
    })

    it('redirects with query param when valid', async () => {
      const req = new Request('http://localhost/home/tvs', {
        method: 'POST',
        body: new URLSearchParams({ query: 'breaking bad' }),
      })
      const res = (await tvsAction({ request: req } as any)) as Response
      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe(
        '/home/tvs?query=breaking%20bad&page=1',
      )
    })
  })
})
