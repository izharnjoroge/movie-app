import { IndividualMovieDetails, Result } from '~/types'

export function MovieHero({
  details,
  trailer,
}: {
  details: IndividualMovieDetails | null
  trailer: Result | undefined
}) {
  return (
    <div
      className='relative h-[70vh] bg-cover bg-center md:h-[80vh]'
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${details?.backdrop_path})`,
      }}
    >
      {/* Overlay */}
      <div className='absolute inset-0 flex items-end bg-black/60 px-4 py-6 md:p-10'>
        <div className='flex max-w-5xl gap-4 md:items-start md:gap-6'>
          {/* Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w300${details?.poster_path}`}
            alt={details?.title}
            className='mx-auto w-32 rounded-xl shadow-lg sm:w-40 md:mx-0 md:w-auto'
          />

          {/* Text content */}
          <div className='mt-4 text-center md:mt-0 md:text-left'>
            <h1 className='text-2xl font-bold sm:text-3xl md:text-4xl'>
              {details?.title}
            </h1>
            <p className='mt-1 text-sm text-gray-300 sm:text-base'>
              {details?.release_date} • ⭐ {details?.vote_average.toFixed(1)}
            </p>
            <p className='mt-3 line-clamp-5 text-gray-200 md:line-clamp-none'>
              {details?.overview}
            </p>

            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target='_blank'
                rel='noreferrer'
                className='mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold sm:text-base'
              >
                ▶ Watch Trailer
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
