//main.features.tsx
import { Link } from '@remix-run/react'
import { ManualCarousel } from '~/components/common/carousel'
import Slider from '~/components/common/slider'
import { Card, CardContent } from '~/components/ui/card'
import { Company, MovieResult } from '~/types'

export function MovieRow({
  title,
  items,
  baseUrl = '/home/movies',
  childUrl = '/home/movie',
}: {
  title: string
  items: MovieResult[]
  baseUrl?: string
  childUrl?: string
}) {
  return (
    <>
      {items.length > 0 ? (
        <section className='space-y-5 px-6'>
          <Link to={baseUrl} className='group relative inline-block text-white'>
            <span className='text-2xl font-semibold transition-transform duration-300 ease-out hover:text-cyan-400 group-hover:scale-110'>
              {title}
            </span>
            {/* underline */}
            <span className='pointer-events-none absolute -bottom-1 left-0 block h-0.5 w-0 bg-cyan-400 transition-[width] duration-300 ease-out group-hover:w-full' />
          </Link>

          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {items?.map(movie => (
              <Link
                key={movie.id}
                to={`${childUrl}/${movie.id}`}
                className='mb-5 flex-shrink-0'
              >
                <div className='relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800'>
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className='h-full w-full object-cover transition hover:scale-105'
                      loading='lazy'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-gray-400'>
                      No Image
                    </div>
                  )}
                </div>
                <p className='mt-3 text-sm font-semibold'>{movie.title}</p>
                <p className='text-sm text-gray-400'>
                  ⭐ {movie.vote_average.toFixed(1)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}

export function CompanyRow({ company }: { company: Company | null }) {
  if (!company) return null

  return (
    <Link to={`/home/studio/${company.id}`} className='group'>
      <Card className='flex flex-col items-center justify-center rounded-2xl border border-gray-600 bg-white/5 p-4 shadow-md transition hover:scale-105 hover:shadow-lg'>
        <CardContent className='flex flex-col items-center gap-4 p-2'>
          <div className='relative h-12 w-full'>
            {company.logo_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                alt={company.name}
                className='h-12 w-auto object-contain transition group-hover:opacity-90'
              />
            ) : (
              <div className='flex h-12 w-full items-center justify-center rounded bg-gray-200 text-sm text-gray-600'>
                No Logo
              </div>
            )}
          </div>
          <h3 className='text-center text-lg font-semibold text-white group-hover:text-red-400'>
            {company.name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  )
}

export function MainHero({ hero }: { hero: MovieResult[] }) {
  return (
    <ManualCarousel
      items={hero}
      maxItems={6}
      renderItem={active => (
        <div className='relative h-[80vh] w-full overflow-hidden'>
          {/* Blurred background */}
          <div className='absolute inset-0'>
            {active.backdrop_path ? (
              <>
                <img
                  src={`https://image.tmdb.org/t/p/w780${active.backdrop_path}`}
                  alt={active.title}
                  className='absolute inset-0 h-full w-full scale-110 object-cover blur-2xl'
                />
                <img
                  src={`https://image.tmdb.org/t/p/w1280${active.backdrop_path}`}
                  alt={active.title}
                  className='absolute inset-0 h-full w-full object-cover sm:object-contain'
                />
              </>
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-gray-800 text-gray-400'>
                No Backdrop
              </div>
            )}
            <div className='absolute inset-0 bg-black/60' />
          </div>

          {/* Content */}
          <div className='absolute bottom-8 left-4 right-4 sm:bottom-12 sm:left-12 sm:max-w-xl'>
            <h1 className='mb-4 text-2xl font-bold text-white drop-shadow-lg sm:text-4xl'>
              {active.title}
            </h1>
            <p className='mb-4 line-clamp-3 text-sm text-gray-200 sm:text-base'>
              {active.overview}
            </p>
            <Link
              to={`/home/movie/${active.id}`}
              className='inline-block rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-red-700'
            >
              View Details
            </Link>
          </div>
        </div>
      )}
    />
  )
}

export function StudioSliderComponent({ companies }: { companies: Company[] }) {
  return (
    <section className='px-6 py-6'>
      <h2 className='mb-10 text-2xl font-semibold'>Studios</h2>
      <div className='w-full'>
        <div className='hidden md:block'>
          <Slider
            direction='horizontal'
            className='w-full'
            duration={500}
            gap={100}
            reverse={false}
            durationOnHover={300}
          >
            <>
              {companies.map(company => (
                <CompanyRow key={company.id} company={company} />
              ))}
            </>
          </Slider>
        </div>
        <div className='flex flex-col gap-4 md:hidden'>
          {companies.map(company => (
            <CompanyRow key={company.id} company={company} />
          ))}
        </div>
      </div>
    </section>
  )
}
