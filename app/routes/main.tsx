// app/routes/main.tsx
import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import Slider from '~/components/common/slider'
import {
  CompanyRow,
  MainHero,
  MovieRow,
} from '~/components/features/main/main.features'
import { Company } from '~/types'
import {
  getCompanyDetails,
  getCompanyMovies,
  getNowPlaying,
  getPopular,
  getTopRated,
  getTrending,
} from '~/utils/apis/api'
import { getSession } from '~/utils/sessions/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const sessionId = session.get('session_id')
  const guestId = session.get('guest_session_id')

  if (!sessionId && !guestId) return redirect('/')

  const [trending, nowPlaying, popular, topRated] = await Promise.all([
    getTrending('movie', 'week'),
    getNowPlaying(),
    getPopular(),
    getTopRated(),
  ])

  const companiesToFetch = [3, 420, 1, 213]
  const companies: Company[] = await Promise.all(
    companiesToFetch.map(async id => {
      const company = await getCompanyDetails(id)
      return company as Company
    }),
  )

  return {
    hero: trending?.results ?? [],
    justReleased: nowPlaying?.results ?? [],
    popular: popular?.results ?? [],
    topRated: topRated?.results ?? [],
    companies,
  }
}

export default function MainPage() {
  const { hero, justReleased, popular, topRated, companies } =
    useLoaderData<typeof loader>()

  return (
    <div className='min-h-screen text-white'>
      {/* Hero Banner */}

      <MainHero hero={hero} />

      {/* Just Released */}
      <div className='mx-auto max-w-[1200px] space-y-6'>
        {/* Companies Section */}
        <section className='px-6 py-6'>
          <h2 className='mb-10 text-2xl font-semibold'>Studios</h2>
          <div className='w-full'>
            <div className='hidden md:block'>
              <Slider
                direction='horizontal'
                className='w-full'
                duration={500}
                gap={100}
                children={companies.map(company => (
                  <CompanyRow key={company.id} company={company} />
                ))}
                reverse={false}
                durationOnHover={300}
              />
            </div>
            <div className='flex flex-col gap-4 md:hidden'>
              {companies.map(company => (
                <CompanyRow key={company.id} company={company} />
              ))}
            </div>
          </div>
        </section>

        <MovieRow title='Just Released' items={justReleased} />

        {/* Popular */}
        <MovieRow title='Popular This Week' items={popular} />

        {/* Top Rated */}
        <MovieRow title='Top Rated' items={topRated} />
      </div>
    </div>
  )
}
