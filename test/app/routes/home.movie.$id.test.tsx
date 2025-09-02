// tests/routes/home.movie.$id.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MoviePage, {
  loader as movieLoader,
  action as movieAction,
} from '~/routes/home.movie.$id'
import * as api from '~/utils/apis/api'
import * as auth from '~/utils/auth/auth.checker'
import { account, credits, details, trailer } from './home.tv.$id.test'
import { movieResponse } from './home._index.test'
import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import * as authChecker from '~/utils/auth/auth.checker'

// --- stub child components ---
vi.mock('~/components/common/movie.hero', () => ({
  MovieHero: ({ details }: { details: any }) => <div>{details?.title}</div>,
}))
vi.mock('~/components/common/movie.body', () => ({
  CastComponent: ({ cast }: { cast: any[] }) => (
    <div>Cast - {cast.length} items</div>
  ),
  SimilarComponent: ({ similar }: { similar: any[] }) => (
    <div>Similar - {similar.length} items</div>
  ),
}))

describe('home.movie.$id route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(api, 'getMovieDetails').mockResolvedValue(details)
    vi.spyOn(api, 'getMovieCredits').mockResolvedValue(credits)
    vi.spyOn(api, 'getMovieVideos').mockResolvedValue(trailer)
    vi.spyOn(api, 'getSimilarMovies').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getAccountDetails').mockResolvedValue(account)
    vi.spyOn(authChecker, 'isAuthenticated').mockResolvedValue({
      sessionId: 'sss',
      guestId: null,
    })
    vi.spyOn(api, 'markAsFavorite').mockResolvedValue({
      success: true,
      status_code: 200,
      status_message: 'Added to favorites',
    })
    vi.spyOn(api, 'addToWatchlist').mockResolvedValue({
      success: true,
      status_code: 200,
      status_message: 'Added to watchlist',
    })
    vi.spyOn(api, 'rateMedia').mockResolvedValue({
      success: true,
      status_code: 200,
      status_message: 'Rated!',
    })
    vi.spyOn(auth, 'isAuthenticated').mockResolvedValue({
      sessionId: 'sess',
      guestId: null,
    })
  })

  function renderWithStub(initialPath = '/home/movie/123') {
    const RemixStub = createRemixStub([
      {
        path: '/home/movie/:id',
        Component: MoviePage,
        loader: movieLoader,
        action: movieAction,
      },
    ])
    return render(<RemixStub initialEntries={[initialPath]} />)
  }

  describe('loader', () => {
    it('returns movie details, cast, trailer and similar', async () => {
      const data = await movieLoader({ params: { id: '123' } } as any)

      expect(data?.details?.id).toBe(911430)
      expect(data?.cast?.length).toBe(1)
      expect(data?.trailer?.id).toBe('686484beb746ffb2a88c265a')
      expect(data?.similar?.[0].id ?? 755898).toBe(755898)
    })

    it('throws 404 if no id', async () => {
      await expect(movieLoader({ params: {} } as any)).rejects.toMatchObject({
        status: 404,
      })
    })
  })

  describe('action()', () => {
    it('redirects if not authenticated', async () => {
      vi.spyOn(auth, 'isAuthenticated').mockResolvedValue({
        sessionId: null,
        guestId: null,
      })
      const req = new Request('http://localhost/home/movie/123', {
        method: 'POST',
        body: new URLSearchParams({ intent: 'favorite' }),
      })
      const res = (await movieAction({ request: req } as any)) as Response
      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('/')
    })

    it('handles favorite intent', async () => {
      const req = new Request('http://localhost/home/movie/123', {
        method: 'POST',
        body: new URLSearchParams({
          intent: 'favorite',
          mediaId: '123',
          mediaType: 'movie',
        }),
      })
      const res = await movieAction({ request: req } as any)
      expect(res).toMatchObject({
        success: true,
        message: 'Added to favorites',
      })
    })

    it('handles watchlist intent', async () => {
      const req = new Request('http://localhost/home/movie/123', {
        method: 'POST',
        body: new URLSearchParams({
          intent: 'watchlist',
          mediaId: '123',
          mediaType: 'movie',
        }),
      })
      const res = await movieAction({ request: req } as any)
      expect(res).toMatchObject({
        success: true,
        message: 'Added to watchlist',
      })
    })

    it('handles rate intent', async () => {
      const req = new Request('http://localhost/home/movie/123', {
        method: 'POST',
        body: new URLSearchParams({
          intent: 'rate',
          mediaId: '123',
          mediaType: 'movie',
          rating: '8',
        }),
      })
      const res = await movieAction({ request: req } as any)
      expect(res).toMatchObject({ success: true, message: 'Rated!' })
    })
  })
  describe('UI', () => {
    it('renders movie page with stubs', async () => {
      renderWithStub()
      expect(await screen.findByText('F1')).toBeInTheDocument()
      expect(await screen.findByText(/Cast - 1 items/)).toBeInTheDocument()
      expect(await screen.findByText(/Similar - 1 items/)).toBeInTheDocument()
    })
  })
})
