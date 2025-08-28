// app/routes/main.tsx
import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Slider from '~/components/common/slider'
import {
  CompanyRow,
  MainHero,
  MovieRow,
  StudioSliderComponent,
} from '~/components/features/main/main.features'
import { Company } from '~/types'
import {
  getCompanyDetails,
  getNowPlaying,
  getPopular,
  getPopularTv,
  getTopRated,
  getTrending,
} from '~/utils/apis/api'
import { STUDIOS } from '~/utils/constants/studios'

export async function loader({ request }: LoaderFunctionArgs) {
  const [trending, nowPlaying, popular, topRated, topRatedTv] =
    await Promise.all([
      getTrending('movie', 'week'),
      getNowPlaying(),
      getPopular(),
      getTopRated(),
      getPopularTv(),
    ])

  const companies: Company[] = await Promise.all(
    STUDIOS.map(async id => {
      const company = await getCompanyDetails(Number(id.id))
      return company as Company
    }),
  )

  return {
    hero: trending?.results ?? [],
    justReleased: nowPlaying?.results ?? [],
    popular: popular?.results ?? [],
    topRated: topRated?.results ?? [],
    topRatedTv: topRatedTv?.results ?? [],
    companies,
  }
}

export default function MainPage() {
  const { hero, justReleased, popular, topRated, companies, topRatedTv } =
    useLoaderData<typeof loader>()

  return (
    <div className='min-h-screen space-y-6 text-white'>
      {/* Hero Banner */}
      <MainHero hero={hero} />

      {/* Companies Section */}
      <StudioSliderComponent companies={companies} />

      <div className='mx-auto max-w-[1200px] space-y-6 md:space-y-8'>
        {/* Just Released */}
        <MovieRow title='Just Released' items={justReleased} />

        {/* Popular */}
        <MovieRow title='Popular This Week' items={popular} />

        {/* Top Rated */}
        <MovieRow title='Top Rated' items={topRated} />

        {/* Top Rated Tv */}
        <MovieRow
          title='Top Rated Tv-Series'
          items={topRatedTv}
          baseUrl='/home/tv'
        />
      </div>
    </div>
  )
}
