// app/routes/movie.$id.tsx

import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import CastComponent, { SimilarComponent } from '~/components/common/movie.body'
import { MovieHero } from '~/components/common/movie.hero'
import {
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies,
} from '~/utils/apis/api'

export async function loader({ params }: LoaderFunctionArgs) {
  const movieId = params.id
  if (!movieId) throw new Response('Movie not found', { status: 404 })

  const [details, credits, videos, similar] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getMovieVideos(movieId),
    getSimilarMovies(movieId),
  ])

  return {
    details,
    cast: credits?.cast.slice(0, 10),
    trailer: videos?.results.find(
      (v: any) => v.type === 'Trailer' && v.site === 'YouTube',
    ),
    similar: similar?.results,
  }
}

export default function MoviePage() {
  const { details, cast, trailer, similar } = useLoaderData<typeof loader>()

  return (
    <div className='min-h-screen'>
      {/* Header Section */}
      <MovieHero details={details} trailer={trailer} />

      <div className='mx-auto max-w-[1200px] space-y-6'>
        {/* Cast */}
        <CastComponent cast={cast} />
        {/* Similar Movies */}
        <SimilarComponent similar={similar} baseUrl='/movie/' />
      </div>
    </div>
  )
}
