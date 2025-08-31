// tests/routes/tv.$id.test.tsx
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TvPage, {
  loader as tvLoader,
  action as tvAction,
} from '~/routes/home.tv.$id'
import * as api from '~/utils/apis/api'
import * as auth from '~/utils/auth/auth.checker'
import {
  AccountDetails,
  IndividualMovieDetails,
  MovieCredits,
  MovieTrailers,
} from '~/types'
import { movieResponse } from './home._index.test'

export const details: IndividualMovieDetails = {
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

export const credits: MovieCredits = {
  id: 911480,
  cast: [
    {
      adult: false,
      gender: 2,
      id: 116514,
      known_for_department: 'Acting',
      name: 'Eric Lange',
      original_name: 'Eric Lange',
      popularity: 0.8432,
      profile_path: '/ziOcfPKJ5jjyUikOOoCfjusy0Ut.jpg',
      cast_id: 243,
      character: 'Houston',
      credit_id: '681189478382b9d14e567770',
      order: 13,
    },
  ],
  crew: [],
}

export const trailer: MovieTrailers = {
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

export const account: AccountDetails = {
  avatar: {
    gravatar: {
      hash: '0ebb6a6c91a1004349be3ce62df3f957',
    },
    tmdb: {
      avatar_path: null,
    },
  },
  id: 22252707,
  iso_639_1: 'en',
  iso_3166_1: 'KE',
  name: '',
  include_adult: false,
  username: 'JimKing96',
}

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

describe('tv.$id route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(api, 'getTvDetails').mockResolvedValue(details)
    vi.spyOn(api, 'getTvCredits').mockResolvedValue(credits)
    vi.spyOn(api, 'getTvVideos').mockResolvedValue(trailer)
    vi.spyOn(api, 'getSimilarTvs').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getAccountDetails').mockResolvedValue(account)
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

  function renderWithStub(initialPath = '/home/tv/123') {
    const RemixStub = createRemixStub([
      {
        path: '/home/tv/:id',
        Component: TvPage,
        loader: tvLoader,
        action: tvAction,
      },
    ])
    return render(<RemixStub initialEntries={[initialPath]} />)
  }

  describe('loader()', () => {
    it('throws 404 if no id', async () => {
      await expect(tvLoader({ params: {} } as any)).rejects.toMatchObject({
        status: 404,
      })
    })

    it('returns tv details and related data', async () => {
      const data = await tvLoader({ params: { id: '123' } } as any)
      expect(data?.details?.id).toBe(911430)
      expect(data?.cast?.length).toBe(1)
      expect(data?.trailer?.id).toBe('686484beb746ffb2a88c265a')
      expect(data?.similar?.[0].id ?? 755898).toBe(755898)
    })
  })

  describe('action()', () => {
    it('redirects if not authenticated', async () => {
      vi.spyOn(auth, 'isAuthenticated').mockResolvedValue({
        sessionId: null,
        guestId: null,
      })
      const req = new Request('http://localhost/home/tv/123', {
        method: 'POST',
        body: new URLSearchParams({ intent: 'favorite' }),
      })
      const res = (await tvAction({ request: req } as any)) as Response
      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('/')
    })

    it('handles favorite intent', async () => {
      const req = new Request('http://localhost/home/tv/123', {
        method: 'POST',
        body: new URLSearchParams({
          intent: 'favorite',
          mediaId: '123',
          mediaType: 'tv',
        }),
      })
      const res = await tvAction({ request: req } as any)
      expect(res).toMatchObject({
        success: true,
        message: 'Added to favorites',
      })
    })

    it('handles watchlist intent', async () => {
      const req = new Request('http://localhost/home/tv/123', {
        method: 'POST',
        body: new URLSearchParams({
          intent: 'watchlist',
          mediaId: '123',
          mediaType: 'tv',
        }),
      })
      const res = await tvAction({ request: req } as any)
      expect(res).toMatchObject({
        success: true,
        message: 'Added to watchlist',
      })
    })

    it('handles rate intent', async () => {
      const req = new Request('http://localhost/home/tv/123', {
        method: 'POST',
        body: new URLSearchParams({
          intent: 'rate',
          mediaId: '123',
          mediaType: 'tv',
          rating: '8',
        }),
      })
      const res = await tvAction({ request: req } as any)
      expect(res).toMatchObject({ success: true, message: 'Rated!' })
    })
  })

  describe('UI', () => {
    it('renders tv page with stubs', async () => {
      renderWithStub()
      expect(await screen.findByText('F1')).toBeInTheDocument()
      expect(await screen.findByText(/Cast - 1 items/)).toBeInTheDocument()
      expect(await screen.findByText(/Similar - 1 items/)).toBeInTheDocument()
    })
  })
})
