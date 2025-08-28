// app/routes/movies.tsx
import { type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { MovieCard } from '~/components/common/movies.card'
import { PaginationComponent } from '~/components/common/pagination'
import { SectionWrapper } from '~/components/common/section.wrapper'
import { getPopular } from '~/utils/apis/api'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') || 1)

  const data = await getPopular(page)
  return {
    movies: data?.results,
    page,
    totalPages: data?.total_results ?? 10,
  }
}

export default function MoviesPage() {
  const { movies, page, totalPages } = useLoaderData<typeof loader>()

  return (
    <SectionWrapper>
      <h1 className='mb-6 text-3xl font-bold'>🎥 Movies Directory</h1>

      {/* Movies Grid */}
      <MovieCard movies={movies ?? []} />

      {/* Pagination */}
      <PaginationComponent
        page={page}
        totalPages={totalPages}
        basePath={`/movies`}
      />
    </SectionWrapper>
  )
}
