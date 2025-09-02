//app.utils.apis.api.ts
import {
  AccountDetails,
  ActionResponse,
  Company,
  IndividualMovieDetails,
  MovieCredits,
  MovieResponse,
  MovieReviews,
  MovieTrailers,
  SimilarMovies,
} from '~/types'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const API_KEY = process.env.API_KEY!
const ACCESS_TOKEN = process.env.ACCESS_TOKEN!

const options = {
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText)
    throw new Error(
      `TMDB API Error (${res.status}): ${res.statusText} - ${errorText}`,
    )
  }

  return res.json()
}

export async function createGuestSession() {
  try {
    const res = await fetch(
      `${TMDB_BASE}/authentication/guest_session/new?api_key=${API_KEY}`,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to create guest session:', error)
    return null
  }
}

export async function createRequestToken() {
  try {
    const res = await fetch(
      `${TMDB_BASE}/authentication/token/new?api_key=${API_KEY}`,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to create request token:', error)
    return null
  }
}

export async function getAccount(sessionId: any): Promise<string | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/account?api_key=${API_KEY}&session_id=${sessionId}`,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to create guest session:', error)
    return null
  }
}

export async function createSession(
  requestToken: string,
): Promise<{ session_id: string; success: boolean }> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/authentication/session/new?api_key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_token: requestToken }),
      },
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to create session:', error)
    return { session_id: '', success: false }
  }
}

export async function getMovie(id: string) {
  try {
    const res = await fetch(`${TMDB_BASE}/movie/${id}?language=en-US`, options)
    return await handleResponse(res)
  } catch (error) {
    console.error(`Failed to fetch movie ${id}:`, error)
    return null
  }
}

export async function getTrending(
  media: string,
  window: string,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/trending/${media}/${window}?language=en-US`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to fetch trending:', error)
    return null
  }
}

export async function getNowPlaying(page = 1): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/now_playing?language=en-US&page=${page}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to fetch now playing movies:', error)
    return null
  }
}

export async function getPopular(page = 1): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/popular?language=en-US&page=${page}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to fetch popular movies:', error)
    return null
  }
}

export async function getPopularTv(page = 1): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/tv/popular?language=en-US&page=${page}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to fetch popular tv:', error)
    return null
  }
}

export async function getTopRated(page = 1): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/top_rated?language=en-US&page=${page}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to fetch top rated movies:', error)
    return null
  }
}

export async function getCompanyMovies(
  companyId: number,
  page = 1,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/company/${companyId}/movies?language=en-US&page=${page}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error(`Failed to fetch company ${companyId} movies:`, error)
    return null
  }
}

export async function getCompanyDetails(
  companyId: number,
): Promise<Company | null> {
  try {
    const res = await fetch(`${TMDB_BASE}/company/${companyId}`, options)
    return await handleResponse(res)
  } catch (error) {
    console.error(`Failed to fetch company ${companyId} details:`, error)
    return null
  }
}

export async function getCompanyDiscoveredMovies(
  companyId: number,
  page = 1,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/discover/movie?with_companies=${companyId}&language=en-US&page=${page}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    console.error(
      `Failed to fetch discovered movies for company ${companyId}:`,
      error,
    )
    return null
  }
}

async function fetchTMDB<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${TMDB_BASE}${path}?language=en-US`, options)
    return await handleResponse(res)
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error)
    return null
  }
}

export const getMovieDetails = (
  id: string,
): Promise<IndividualMovieDetails | null> => fetchTMDB(`/movie/${id}`)
export const getMovieCredits = (id: string): Promise<MovieCredits | null> =>
  fetchTMDB(`/movie/${id}/credits`)
export const getMovieVideos = (id: string): Promise<MovieTrailers | null> =>
  fetchTMDB(`/movie/${id}/videos`)
export const getSimilarMovies = (id: string): Promise<SimilarMovies | null> =>
  fetchTMDB(`/movie/${id}/similar`)
export const getMovieReviews = (id: string): Promise<MovieReviews | null> =>
  fetchTMDB(`/movie/${id}/similar`)

export const getTvDetails = (
  id: string,
): Promise<IndividualMovieDetails | null> => fetchTMDB(`/tv/${id}`)
export const getTvCredits = (id: string): Promise<MovieCredits | null> =>
  fetchTMDB(`/tv/${id}/credits`)
export const getTvVideos = (id: string): Promise<MovieTrailers | null> =>
  fetchTMDB(`/tv/${id}/videos`)
export const getSimilarTvs = (id: string): Promise<SimilarMovies | null> =>
  fetchTMDB(`/tv/${id}/similar`)
export const getTvReviews = (id: string): Promise<MovieReviews | null> =>
  fetchTMDB(`/tv/${id}/similar`)

// Account details
export async function getAccountDetails(
  accountId: string,
): Promise<AccountDetails | null> {
  try {
    const res = await fetch(`${TMDB_BASE}/account/${accountId}`, options)
    return await handleResponse(res)
  } catch (error) {
    return null
  }
}

// Favorites
export async function getFavoriteMovies(
  accountId: number,
  sessionId: string,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/account/${accountId}/favorite/movies?session_id=${sessionId}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    return null
  }
}

export async function getFavoriteTv(
  accountId: number,
  sessionId: string,
): Promise<MovieResponse | null> {
  try {
    console.log(sessionId)
    const res = await fetch(
      `${TMDB_BASE}/account/${accountId}/favorite/tv?session_id=${sessionId}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    return null
  }
}

// Watchlist
export async function getWatchlistMovies(
  accountId: number,
  sessionId: string,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/account/${accountId}/watchlist/movies?session_id=${sessionId}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    return null
  }
}

export async function getWatchlistTv(
  accountId: number,
  sessionId: string,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/account/${accountId}/watchlist/tv?session_id=${sessionId}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    return null
  }
}

// Rated
export async function getRatedMovies(
  accountId: number,
  sessionId: string,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/account/${accountId}/rated/movies?session_id=${sessionId}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    return null
  }
}

export async function getRatedTv(
  accountId: number,
  sessionId: string,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/account/${accountId}/rated/tv?session_id=${sessionId}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    return null
  }
}

export async function markAsFavorite(
  accountId: number,
  sessionId: string,
  mediaId: number,
  mediaType: 'movie' | 'tv',
  favorite: boolean,
): Promise<ActionResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/account/${accountId}/favorite?session_id=${sessionId}`,
      {
        ...options,
        method: 'POST',
        body: JSON.stringify({
          media_type: mediaType,
          media_id: mediaId,
          favorite: favorite,
        }),
      },
    )

    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to mark as favorite:', error)
    return null
  }
}

export async function addToWatchlist(
  accountId: number,
  sessionId: string,
  mediaId: number,
  mediaType: 'movie' | 'tv',
  watchlist: boolean,
): Promise<ActionResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/account/${accountId}/watchlist?session_id=${sessionId}`,
      {
        ...options,
        method: 'POST',
        body: JSON.stringify({
          media_type: mediaType,
          media_id: mediaId,
          watchlist,
        }),
      },
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to add to watchlist:', error)
    return null
  }
}

export async function rateMedia(
  mediaId: number,
  sessionId: string,
  mediaType: 'movie' | 'tv',
  rating: number,
): Promise<ActionResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/${mediaType}/${mediaId}/rating?session_id=${sessionId}`,
      {
        ...options,
        method: 'POST',
        body: JSON.stringify({ value: rating }),
      },
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Failed to rate media:', error)
    return null
  }
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    return null
  }
}

export async function searchTvs(
  query: string,
  page = 1,
): Promise<MovieResponse | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/search/tv?query=${encodeURIComponent(query)}&page=${page}`,
      options,
    )
    return await handleResponse(res)
  } catch (error) {
    return null
  }
}
