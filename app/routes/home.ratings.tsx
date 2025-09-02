// app/routes/home.ratings.tsx
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
  getAccount,
  getAccountDetails,
  getRatedMovies,
  getRatedTv,
} from '~/utils/apis/api'
import { SectionWrapper } from '~/components/common/section.wrapper'
import { MovieRow } from '~/components/features/main/main.features'
import { isAuthenticated } from '~/utils/auth/auth.checker'

export async function loader({ request }: LoaderFunctionArgs) {
  const { sessionId } = await isAuthenticated(request)
  if (!sessionId) return redirect('/home')
  const accountId = await getAccount(sessionId)
  if (accountId) {
    const account = await getAccountDetails(accountId)
    if (account?.id) {
      const movies = await getRatedMovies(account?.id, sessionId)
      const tv = await getRatedTv(account.id, sessionId)

      return { movies: movies?.results, tv: tv?.results }
    }
  }

  return { movies: [], tv: [] }
}

export default function RatingsPage() {
  const { movies, tv } = useLoaderData<typeof loader>()

  return (
    <SectionWrapper>
      <h2 className='mb-4 text-2xl font-bold'>⭐ My Ratings</h2>

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
