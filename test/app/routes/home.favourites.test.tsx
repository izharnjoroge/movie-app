// tests/routes/home.favorites.test.tsx
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FavoritesPage, {
  loader as favoritesLoader,
} from '~/routes/home.favorites'
import * as api from '~/utils/apis/api'
import * as auth from '~/utils/auth/auth.checker'
import { account } from './home.tv.$id.test'
import { movieResponse } from './home._index.test'

// stub child components
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

// --- helper to unwrap loader data ---
async function runLoader(loader: any, request: Request) {
  const result = await loader({ request } as any)
  if (result instanceof Response) throw new Error('Got Response, expected data')
  return result as { movies?: any[]; tv?: any[] }
}

describe('home.favorites route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(auth, 'isAuthenticated').mockResolvedValue({
      sessionId: 'sess',
      guestId: null,
    })
    vi.spyOn(api, 'getAccount').mockResolvedValue('account-id')
    vi.spyOn(api, 'getAccountDetails').mockResolvedValue(account)
    vi.spyOn(api, 'getFavoriteMovies').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getFavoriteTv').mockResolvedValue(movieResponse)
  })

  function renderWithStub(initialPath = '/home/favorites') {
    const RemixStub = createRemixStub([
      {
        path: '/home/favorites',
        Component: FavoritesPage,
        loader: favoritesLoader,
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
      const res = (await favoritesLoader({
        request: new Request('http://x'),
      } as any)) as Response
      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('/home')
    })

    it('returns favorite movies and tv if account exists', async () => {
      const data = await runLoader(favoritesLoader, new Request('http://x'))
      expect(data.movies?.length).toBe(1)
      expect(data.tv?.length).toBe(1)
      expect(data.movies?.[0].title).toBe('War of the Worlds')
      expect(data.tv?.[0].title).toBe('War of the Worlds')
    })

    it('returns empty arrays if account is missing', async () => {
      vi.spyOn(api, 'getAccount').mockResolvedValue(null)
      const data = await runLoader(favoritesLoader, new Request('http://x'))
      expect(data.movies).toEqual([])
      expect(data.tv).toEqual([])
    })
  })

  describe('UI', () => {
    it('renders favorites page with stubbed rows', async () => {
      renderWithStub()
      expect(await screen.findByText('⭐ Favorites')).toBeInTheDocument()
      expect(await screen.findByText(/Movies - 1 items/)).toBeInTheDocument()
      expect(await screen.findByText(/Tv Shows - 1 items/)).toBeInTheDocument()
    })
  })
})
