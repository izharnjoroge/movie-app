// app/routes/studio.$id.tsx

import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { MovieCard } from '~/components/common/movies.card'
import { PaginationComponent } from '~/components/common/pagination'
import { Pagination } from '~/components/ui/pagination'
import { getCompanyDetails, getCompanyDiscoveredMovies } from '~/utils/apis/api'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const companyId = params.id
  if (!companyId) throw new Response('Studio not found', { status: 404 })

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') || 1)

  const data = await getCompanyDiscoveredMovies(Number(companyId), page)
  const company = await getCompanyDetails(Number(companyId))

  if (!data) throw new Response('Failed to fetch movies', { status: 500 })

  return {
    companyId,
    movies: data.results,
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    company,
  }
}

export default function StudioPage() {
  const { movies, page, totalPages, companyId, company } =
    useLoaderData<typeof loader>()

  return (
    <div className='mx-auto min-h-screen max-w-[1200px] text-white'>
      <h1 className='mb-8 text-3xl font-bold'>
        🎥 Movies From {company?.name}
      </h1>

      {/* Movies Grid */}
      <MovieCard movies={movies} />

      {/* Pagination */}
      <PaginationComponent
        page={page}
        totalPages={totalPages}
        basePath={`/studio/${companyId}`}
      />
    </div>
  )
}
