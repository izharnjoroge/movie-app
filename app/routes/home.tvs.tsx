// app/routes/home.tvs.tsx
import {
  ActionFunctionArgs,
  redirect,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { MovieCard } from '~/components/common/movies.card'
import { PaginationComponent } from '~/components/common/pagination'
import { SearchForm } from '~/components/common/search'
import { SectionWrapper } from '~/components/common/section.wrapper'
import { getPopularTv, searchTvs } from '~/utils/apis/api'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') || 1)
  const query = url.searchParams.get('query')

  const data = query ? await searchTvs(query, page) : await getPopularTv(page)

  return {
    shows: data?.results,
    page,
    totalPages: data?.total_pages ?? 10,
    query,
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const query = formData.get('query')
  if (!query || typeof query !== 'string') {
    return redirect('/home/tvs')
  }
  return redirect(`/home/tvs?query=${encodeURIComponent(query)}&page=1`)
}

export default function TVPage() {
  const { shows, page, totalPages, query } = useLoaderData<typeof loader>()

  return (
    <SectionWrapper>
      <h1 className='mb-6 text-3xl font-bold'>📺 TV Series Directory</h1>

      {/* Search */}
      <SearchForm placeholder='Search for a show...' baseUrl='/home/tvs' />

      <MovieCard movies={shows ?? []} baseUrl='/home/tv' />

      {/* Pagination */}
      <PaginationComponent
        page={page}
        totalPages={totalPages}
        basePath={
          query ? `/home/tvs?query=${encodeURIComponent(query)}` : `/home/tvs`
        }
      />
    </SectionWrapper>
  )
}
