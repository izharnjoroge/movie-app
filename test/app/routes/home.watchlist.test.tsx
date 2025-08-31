// tests/routes/home.watchlist.test.tsx
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import WatchListPage, {
  loader as watchlistLoader,
} from '~/routes/home.watch-list'
import * as api from '~/utils/apis/api'
import * as auth from '~/utils/auth/auth.checker'
import { account } from './home.tv.$id.test'
import { movieResponse } from './home._index.test'

vi.mock('~/components/features/main/main.features', () => ({
  MovieRow: ({ items, title }: { items: any[]; title: string }) => (
    <div>
      {title} - {items.length} items
    </div>
  ),
}))
vi.mock('~/components/common/section.wrapper', () => ({
  SectionWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

describe('home.watchlist route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(auth, 'isAuthenticated').mockResolvedValue({
      sessionId: 'sess',
      guestId: null,
    })
    vi.spyOn(api, 'getAccount').mockResolvedValue('account-id')
    vi.spyOn(api, 'getAccountDetails').mockResolvedValue(account)
    vi.spyOn(api, 'getWatchlistMovies').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getWatchlistTv').mockResolvedValue(movieResponse)
  })

  function renderWithStub(initialPath = '/home/watchlist') {
    const RemixStub = createRemixStub([
      {
        path: '/home/watchlist',
        Component: WatchListPage,
        loader: watchlistLoader,
      },
    ])
    return render(<RemixStub initialEntries={[initialPath]} />)
  }

  describe('loader()', () => {
    it('redirects if not authenticated', async () => {
      vi.spyOn(auth, 'isAuthenticated').mockResolvedValue({
        sessionId: null,
        guestId: null,
      })
      const res = (await watchlistLoader({
        request: new Request('http://x'),
      } as any)) as Response
      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('/home')
    })

    it('returns rated movies and tv if account exists', async () => {
      const result = await watchlistLoader({
        request: new Request('http://x'),
      } as any)

      if ('movies' in result) {
        expect(result.movies?.length).toBe(1)
        expect(result.tv?.length).toBe(1)
        expect(result.movies?.[0].title).toBe('War of the Worlds')
        expect(result.tv?.[0].title).toBe('War of the Worlds')
      } else {
        throw new Error('Expected loader to return data, got Response')
      }
    })

    it('returns empty arrays if account is missing', async () => {
      vi.spyOn(api, 'getAccount').mockResolvedValue(null)
      const data = await watchlistLoader({
        request: new Request('http://x'),
      } as any)
      if ('movies' in data) {
        expect(data.movies).toEqual([])
        expect(data.tv).toEqual([])
      }
    })
  })

  describe('UI', () => {
    it('renders watchlist page with stubbed rows', async () => {
      renderWithStub()
      expect(await screen.findByText('📺 Watchlist')).toBeInTheDocument()
      expect(await screen.findByText(/Movies - 1 items/)).toBeInTheDocument()
      expect(await screen.findByText(/Tv Shows - 1 items/)).toBeInTheDocument()
    })
  })
})
