import { Link } from '@remix-run/react'
import { Cast, SimilarResult } from '~/types'

export default function CastComponent({ cast }: { cast: Cast[] | undefined }) {
  return (
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
  )
}

export function SimilarComponent({
  similar,
  baseUrl,
}: {
  similar: SimilarResult[] | undefined
  baseUrl: string
}) {
  return (
    <section className='px-6 py-8'>
      <h2 className='mb-4 text-2xl font-semibold'>Similar</h2>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {similar?.map(movie => (
          <Link
            key={movie.id}
            to={`/home${baseUrl}${movie.id}`}
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
  )
}
