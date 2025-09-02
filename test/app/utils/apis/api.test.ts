import { describe, it, expect, beforeEach } from 'vitest'
import * as api from '~/utils/apis/api'
import { vi } from 'vitest'

/**
 * Mock global fetch with a successful JSON response
 */
export function mockFetchSuccess<T>(data: T, ok = true, status = 200) {
  const mock = vi.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
    clone() {
      return this
    },
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

/**
 * Mock global fetch with a failed response
 */
export function mockFetchError(
  status = 500,
  statusText = 'Server Error',
  body = 'Error',
) {
  const mock = vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText,
    text: async () => body,
    json: async () => ({ error: 'Test error' }),
    headers: new Headers(),
    clone() {
      return this
    },
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

describe('TMDB API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('createGuestSession works', async () => {
    const data = { guest_session_id: 'guest-1' }
    mockFetchSuccess(data)
    expect(await api.createGuestSession()).toEqual(data)

    mockFetchError(401, 'Unauthorized')
    expect(await api.createGuestSession()).toBeNull()
  })

  it('createRequestToken works', async () => {
    const data = { request_token: 'req-1' }
    mockFetchSuccess(data)
    expect(await api.createRequestToken()).toEqual(data)

    mockFetchError(401, 'Unauthorized')
    expect(await api.createRequestToken()).toBeNull()
  })

  it('getAccount works', async () => {
    const data = { id: 'acc-1' }
    mockFetchSuccess(data)
    expect(await api.getAccount('sess-1')).toEqual(data)

    mockFetchError(500)
    expect(await api.getAccount('sess-1')).toBeNull()
  })

  it('createSession works', async () => {
    const data = { session_id: 'sess-1', success: true }
    mockFetchSuccess(data)
    expect(await api.createSession('req-1')).toEqual(data)

    mockFetchError(500)
    expect(await api.createSession('req-1')).toEqual({
      session_id: '',
      success: false,
    })
  })

  it('getMovie works', async () => {
    const data = { id: 'm1' }
    mockFetchSuccess(data)
    expect(await api.getMovie('m1')).toEqual(data)

    mockFetchError(404)
    expect(await api.getMovie('m1')).toBeNull()
  })

  it('getTrending works', async () => {
    const data = { results: [] }
    mockFetchSuccess(data)
    expect(await api.getTrending('movie', 'day')).toEqual(data)

    mockFetchError(404)
    expect(await api.getTrending('movie', 'day')).toBeNull()
  })

  it('getNowPlaying works', async () => {
    const data = { results: [] }
    mockFetchSuccess(data)
    expect(await api.getNowPlaying(1)).toEqual(data)

    mockFetchError(500)
    expect(await api.getNowPlaying(1)).toBeNull()
  })

  it('getPopular works', async () => {
    const data = { results: [] }
    mockFetchSuccess(data)
    expect(await api.getPopular(1)).toEqual(data)

    mockFetchError(500)
    expect(await api.getPopular(1)).toBeNull()
  })

  it('getPopularTv works', async () => {
    const data = { results: [] }
    mockFetchSuccess(data)
    expect(await api.getPopularTv(1)).toEqual(data)

    mockFetchError(500)
    expect(await api.getPopularTv(1)).toBeNull()
  })

  it('getTopRated works', async () => {
    const data = { results: [] }
    mockFetchSuccess(data)
    expect(await api.getTopRated(1)).toEqual(data)

    mockFetchError(500)
    expect(await api.getTopRated(1)).toBeNull()
  })

  it('getCompanyMovies works', async () => {
    const data = { results: [] }
    mockFetchSuccess(data)
    expect(await api.getCompanyMovies(1, 1)).toEqual(data)

    mockFetchError(500)
    expect(await api.getCompanyMovies(1, 1)).toBeNull()
  })

  it('getCompanyDetails works', async () => {
    const data = { id: 1 }
    mockFetchSuccess(data)
    expect(await api.getCompanyDetails(1)).toEqual(data)

    mockFetchError(500)
    expect(await api.getCompanyDetails(1)).toBeNull()
  })

  it('getCompanyDiscoveredMovies works', async () => {
    const data = { results: [] }
    mockFetchSuccess(data)
    expect(await api.getCompanyDiscoveredMovies(1, 1)).toEqual(data)

    mockFetchError(500)
    expect(await api.getCompanyDiscoveredMovies(1, 1)).toBeNull()
  })

  it('movie + tv detail helpers work', async () => {
    const data = { id: 1 }
    mockFetchSuccess(data)
    expect(await api.getMovieDetails('1')).toEqual(data)
    expect(await api.getMovieCredits('1')).toEqual(data)
    expect(await api.getMovieVideos('1')).toEqual(data)
    expect(await api.getSimilarMovies('1')).toEqual(data)
    expect(await api.getMovieReviews('1')).toEqual(data)

    expect(await api.getTvDetails('1')).toEqual(data)
    expect(await api.getTvCredits('1')).toEqual(data)
    expect(await api.getTvVideos('1')).toEqual(data)
    expect(await api.getSimilarTvs('1')).toEqual(data)
    expect(await api.getTvReviews('1')).toEqual(data)
  })

  it('getAccountDetails works', async () => {
    const data = { id: 'acc-1' }
    mockFetchSuccess(data)
    expect(await api.getAccountDetails('acc-1')).toEqual(data)

    mockFetchError(500)
    expect(await api.getAccountDetails('acc-1')).toBeNull()
  })

  it('favorites + watchlist + rated APIs work', async () => {
    const data = { results: [] }
    mockFetchSuccess(data)
    expect(await api.getFavoriteMovies(1, 's')).toEqual(data)
    expect(await api.getFavoriteTv(1, 's')).toEqual(data)
    expect(await api.getWatchlistMovies(1, 's')).toEqual(data)
    expect(await api.getWatchlistTv(1, 's')).toEqual(data)
    expect(await api.getRatedMovies(1, 's')).toEqual(data)
    expect(await api.getRatedTv(1, 's')).toEqual(data)
  })

  it('markAsFavorite works', async () => {
    const data = { success: true, status_code: 200, status_message: 'Success' }
    mockFetchSuccess(data)
    expect(await api.markAsFavorite(1, 's', 100, 'movie', true)).toEqual(data)

    mockFetchError(500)
    expect(await api.markAsFavorite(1, 's', 100, 'movie', true)).toBeNull()
  })

  it('addToWatchlist works', async () => {
    const data = { success: true, status_code: 200, status_message: 'Success' }
    mockFetchSuccess(data)
    expect(await api.addToWatchlist(1, 's', 100, 'movie', true)).toEqual(data)

    mockFetchError(500)
    expect(await api.addToWatchlist(1, 's', 100, 'movie', true)).toBeNull()
  })

  it('rateMedia works', async () => {
    const data = { success: true, status_code: 200, status_message: 'Success' }
    mockFetchSuccess(data)
    expect(await api.rateMedia(100, 's', 'movie', 8)).toEqual(data)

    mockFetchError(500)
    expect(await api.rateMedia(100, 's', 'movie', 8)).toBeNull()
  })

  it('searchMovies + searchTvs work', async () => {
    const data = { results: [] }
    mockFetchSuccess(data)
    expect(await api.searchMovies('matrix', 1)).toEqual(data)
    expect(await api.searchTvs('matrix', 1)).toEqual(data)

    mockFetchError(500)
    expect(await api.searchMovies('matrix', 1)).toBeNull()
    expect(await api.searchTvs('matrix', 1)).toBeNull()
  })
})
