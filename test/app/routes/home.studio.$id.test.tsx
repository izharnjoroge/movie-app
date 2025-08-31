// tests/routes/home.studio.$id.test.tsx
import { screen, render } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import {
  loader as studioLoader,
  default as StudioPage,
} from '~/routes/home.studio.$id'
import * as api from '~/utils/apis/api'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { company, movieResponse } from './home._index.test'
import { Company } from '~/types'

vi.mock('~/components/common/movies.card', () => ({
  MovieCard: ({ movies }: { movies: any[] }) => (
    <div>Movies - {movies.length} items</div>
  ),
}))

vi.mock('~/components/common/pagination', () => ({
  PaginationComponent: ({
    page,
    totalPages,
  }: {
    page: number
    totalPages: number
  }) => (
    <div>
      Page {page} of {totalPages}
    </div>
  ),
}))

describe('home.studio.$id route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(api, 'getCompanyDiscoveredMovies').mockResolvedValue(movieResponse)
    vi.spyOn(api, 'getCompanyDetails').mockResolvedValue(company)
  })

  function renderWithStub(initialPath = '/home/studio/999') {
    const RemixStub = createRemixStub([
      {
        path: '/home/studio/:id',
        Component: StudioPage,
        loader: studioLoader,
      },
    ])
    return render(<RemixStub initialEntries={[initialPath]} />)
  }

  describe('loader()', () => {
    it('throws 404 if no id', async () => {
      await expect(studioLoader({ params: {} } as any)).rejects.toMatchObject({
        status: 404,
      })
    })

    it('throws 500 if movies fail to load', async () => {
      vi.spyOn(api, 'getCompanyDiscoveredMovies').mockResolvedValue(null)

      await expect(
        studioLoader({
          params: { id: '999' },
          request: new Request('http://localhost'),
        } as any),
      ).rejects.toMatchObject({ status: 500 })
    })

    it('returns movies and company data', async () => {
      const data = await studioLoader({
        params: { id: '999' },
        request: new Request('http://localhost/home/studio/999?page=1'),
      } as any)

      expect(data.company?.name).toBe('Walt Disney Pictures')
      expect(data.movies?.length).toBe(1)
      expect(data.page).toBe(1)
      expect(data.totalPages).toBe(2)
    })
  })

  describe('UI', () => {
    it('renders studio page with mocked components', async () => {
      renderWithStub()
      expect(
        await screen.findByText(/Movies From Walt Disney Pictures/),
      ).toBeInTheDocument()
      expect(await screen.findByText(/Movies - 1 items/)).toBeInTheDocument()
      expect(await screen.findByText(/Page 1 of 2/)).toBeInTheDocument()
    })
  })
})
