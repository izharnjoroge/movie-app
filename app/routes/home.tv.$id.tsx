// app/routes/tv.$id.tsx

import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import CastComponent, { SimilarComponent } from '~/components/common/movie.body'
import { MovieHero } from '~/components/common/movie.hero'
import {
  getSimilarTvs,
  getTvCredits,
  getTvDetails,
  getTvVideos,
} from '~/utils/apis/api'

export async function loader({ params }: LoaderFunctionArgs) {
  const tvId = params.id
  if (!tvId) throw new Response('Tv-Series not found', { status: 404 })

  const [details, credits, videos, similar] = await Promise.all([
    getTvDetails(tvId),
    getTvCredits(tvId),
    getTvVideos(tvId),
    getSimilarTvs(tvId),
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

export default function TvPage() {
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
