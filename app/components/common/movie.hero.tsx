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
  )
}
