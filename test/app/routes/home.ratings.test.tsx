// tests/routes/home.ratings.test.tsx
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RatingsPage, { loader as ratingsLoader } from '~/routes/home.ratings'
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

describe('home.ratings route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(auth, 'isAuthenticated').mockResolvedValue({
      sessionId: 'sess',
      guestId: null,
    })
    vi.spyOn(api, 'getAccount').mockResolvedValue('account-id')
    vi.spyOn(api, 'getAccountDetails').mockResolvedValue(account)
    vi.spyOn(api, 'getRatedMovies').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getRatedTv').mockResolvedValue(movieResponse)
  })

  function renderWithStub(initialPath = '/home/ratings') {
    const RemixStub = createRemixStub([
      {
        path: '/home/ratings',
        Component: RatingsPage,
        loader: ratingsLoader,
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
      const res = (await ratingsLoader({
        request: new Request('http://x'),
      } as any)) as Response
      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('/home')
    })

    it('returns rated movies and tv if account exists', async () => {
      const result = await ratingsLoader({
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
      const data = await ratingsLoader({
        request: new Request('http://x'),
      } as any)
      if ('movies' in data) {
        expect(data.movies).toEqual([])
        expect(data.tv).toEqual([])
      }
    })
  })

  describe('UI', () => {
    it('renders ratings page with stubbed rows', async () => {
      renderWithStub()
      expect(await screen.findByText('⭐ My Ratings')).toBeInTheDocument()
      expect(await screen.findByText(/Movies - 1 items/)).toBeInTheDocument()
      expect(await screen.findByText(/Tv Shows - 1 items/)).toBeInTheDocument()
    })
  })
})
