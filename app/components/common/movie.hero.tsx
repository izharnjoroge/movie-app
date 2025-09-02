//app.components.common.movie.hero.tsx
import { Form, useNavigation } from '@remix-run/react'
import { IndividualMovieDetails, TrailerResult } from '~/types'
import { Button } from '../ui/button'

export function MovieHero({
  details,
  trailer,
  type = 'movie',
  sessionId,
}: {
  details: IndividualMovieDetails | null
  trailer: TrailerResult | undefined
  type?: 'movie' | 'tv'
  sessionId: string | null
}) {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  if (!details) return null

  return (
    <div
      className='relative h-[80vh] bg-cover bg-center'
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
      }}
    >
      {/* Overlay */}
      <div className='absolute inset-0 flex items-end bg-black/70 px-4 py-6 md:p-10'>
        <div className='flex max-w-5xl gap-4 md:items-start md:gap-6'>
          {/* Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
            alt={details.title}
            className='mx-auto w-40 rounded-xl shadow-lg sm:w-48 md:mx-0 md:w-56'
          />

          {/* Text content */}
          <div className='mt-4 text-center text-white md:mt-0 md:text-left'>
            <h1 className='text-2xl font-bold sm:text-3xl md:text-4xl'>
              {details.title}
            </h1>
            <p className='mt-1 text-sm text-gray-300 sm:text-base'>
              {details.release_date} • ⭐ {details.vote_average.toFixed(1)}
            </p>
            <p className='mt-3 line-clamp-3 text-gray-200 md:line-clamp-none'>
              {details.overview}
            </p>

            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target='_blank'
                rel='noreferrer'
                className='mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold sm:text-base'
              >
                ▶ Trailer
              </a>
            )}

            {/* --- User Actions --- */}
            {sessionId && (
              <div className='mt-6 flex flex-wrap justify-center gap-3 md:mt-12'>
                {/* Favorite */}
                <Form method='post'>
                  <input type='hidden' name='intent' value='favorite' />
                  <input type='hidden' name='mediaId' value={details.id} />
                  <input type='hidden' name='mediaType' value={type} />
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold shadow hover:bg-pink-700'
                  >
                    ❤️ Fav
                  </Button>
                </Form>

                {/* Watchlist */}
                <Form method='post'>
                  <input type='hidden' name='intent' value='watchlist' />
                  <input type='hidden' name='mediaId' value={details.id} />
                  <input type='hidden' name='mediaType' value={type} />
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold shadow hover:bg-blue-700'
                  >
                    📺 Watch
                  </Button>
                </Form>

                {/* Rate */}
                <Form method='post' className='flex items-center gap-2'>
                  <input type='hidden' name='intent' value='rate' />
                  <input type='hidden' name='mediaId' value={details.id} />
                  <input type='hidden' name='mediaType' value={type} />
                  <input
                    type='number'
                    name='rating'
                    min='0.5'
                    max='10'
                    step='0.5'
                    className='w-20 rounded px-2 py-1 text-black'
                    placeholder='0-10'
                  />
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold shadow hover:bg-yellow-600'
                  >
                    ⭐ Rate
                  </Button>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
