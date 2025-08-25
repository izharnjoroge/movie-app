// app/routes/movie.$id.tsx

import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
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
      <div
        className='relative h-[80vh] bg-cover bg-center'
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${details?.backdrop_path})`,
        }}
      >
        <div className='absolute inset-0 flex items-end bg-black/60 p-10'>
          <div className='flex max-w-5xl gap-6'>
            <img
              src={`https://image.tmdb.org/t/p/w300${details?.poster_path}`}
              alt={details?.title}
              className='rounded-xl shadow-lg'
            />
            <div>
              <h1 className='text-4xl font-bold'>{details?.title}</h1>
              <p className='mt-2 text-gray-300'>
                {details?.release_date} • ⭐ {details?.vote_average.toFixed(1)}
              </p>
              <p className='mt-4 text-gray-200'>{details?.overview}</p>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target='_blank'
                  rel='noreferrer'
                  className='mt-6 inline-block rounded-lg bg-red-600 px-4 py-2 font-semibold'
                >
                  ▶ Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-[1200px] space-y-6'>
        {/* Cast */}
        <section className='px-6 py-8'>
          <h2 className='mb-4 text-2xl font-semibold'>Top Cast</h2>
          <div className='flex gap-4'>
            {cast?.map(actor => (
              <div key={actor.id} className='w-28 flex-shrink-0 text-center'>
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  className='mb-2 rounded-lg'
                />
                <p className='text-sm font-semibold'>{actor.name}</p>
                <p className='text-xs text-gray-400'>{actor.character}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Similar Movies */}
        <section className='px-6 py-8'>
          <h2 className='mb-4 text-2xl font-semibold'>Similar Movies</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {similar?.map(movie => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className='w-36 flex-shrink-0'
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
                  alt={movie.title}
                  className='rounded-lg transition hover:scale-105'
                />
                <p className='mt-2 text-sm font-semibold'>{movie.title}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
