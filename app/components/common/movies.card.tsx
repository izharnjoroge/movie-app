import { Link } from '@remix-run/react'
import { MovieResult } from '~/types'

export function MovieCard({ movies }: { movies: MovieResult[] }) {
  return (
    <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
      {movies.map(movie => (
        <Link
          key={movie.id}
          to={`/home/movie/${movie.id}`}
          className='overflow-hidden rounded-xl bg-white/10 shadow transition hover:scale-105'
        >
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className='h-70 w-full object-contain'
          />
          <div className='p-3'>
            <h3 className='truncate text-sm font-semibold'>
              {movie.title || movie.name}
            </h3>
            <p className='text-xs text-gray-300'>
              {movie.release_date?.slice(0, 4)}
            </p>
            <p className='mt-1 text-xs text-yellow-400'>
              ⭐ {movie.vote_average.toFixed(1)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
