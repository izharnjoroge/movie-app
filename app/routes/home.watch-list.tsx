// app/routes/home.watchlist.tsx
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getSession } from '~/utils/sessions/session.server'
import {
  getAccount,
  getAccountDetails,
  getWatchlistMovies,
  getWatchlistTv,
} from '~/utils/apis/api'
import { MovieRow } from '~/components/features/main/main.features'
import { SectionWrapper } from '~/components/common/section.wrapper'
import { isAuthenticated } from '~/utils/auth/auth.checker'

export async function loader({ request }: LoaderFunctionArgs) {
  const { sessionId } = await isAuthenticated(request)
  if (!sessionId) return redirect('/home')
  const accountId = await getAccount(sessionId)
  if (accountId) {
    const account = await getAccountDetails(accountId)
    if (account?.id) {
      const movies = await getWatchlistMovies(account?.id, sessionId)
      const tv = await getWatchlistTv(account.id, sessionId)

      return { movies: movies?.results, tv: tv?.results }
    }
  }

  return { movies: [], tv: [] }
}

export default function WatchListPage() {
  const { movies, tv } = useLoaderData<typeof loader>()

  return (
    <SectionWrapper>
      <h2 className='mb-4 text-2xl font-bold'>📺 Watchlist</h2>

      <MovieRow items={movies ?? []} title='Movies' />

      <MovieRow
        items={tv ?? []}
        title='Tv Shows'
        baseUrl='/home/tvs'
        childUrl='/home/tv'
      />
    </SectionWrapper>
  )
}
