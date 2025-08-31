// tests/routes/studios.test.tsx
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import StudiosPage, { loader as studiosLoader } from '~/routes/home.studios'
import * as api from '~/utils/apis/api'
import * as session from '~/utils/sessions/session.server'
import { STUDIOS } from '~/utils/constants/studios'
import { company } from './home._index.test'

// stub components
vi.mock('~/components/features/main/main.features', () => ({
  CompanyRow: ({ company }: { company: any }) => <div>{company.name}</div>,
}))
vi.mock('~/components/common/section.wrapper', () => ({
  SectionWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

// helper to unwrap loader return
async function runLoader(loader: any, request: Request) {
  const result = await loader({ request } as any)
  if (result instanceof Response) throw result
  return result as { companies: any[] }
}

describe('studios route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(session, 'getSession').mockResolvedValue({
      get: (key: string) => (key === 'session_id' ? 'sess' : null),
    } as any)

    vi.spyOn(api, 'getCompanyDetails').mockImplementation(
      async (id: number) => company,
    )
  })

  function renderWithStub(initialPath = '/studios') {
    const RemixStub = createRemixStub([
      {
        path: '/studios',
        Component: StudiosPage,
        loader: studiosLoader,
      },
    ])
    return render(<RemixStub initialEntries={[initialPath]} />)
  }

  describe('loader()', () => {
    it('redirects if no sessionId or guestId', async () => {
      vi.spyOn(session, 'getSession').mockResolvedValue({
        get: () => null,
      } as any)

      const res = (await studiosLoader({
        request: new Request('http://x'),
      } as any)) as Response

      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('/')
    })

    it('loads companies from STUDIOS list', async () => {
      const data = await runLoader(studiosLoader, new Request('http://x'))
      expect(data.companies.length).toBe(STUDIOS.length)
      expect(data.companies[0]).toHaveProperty('id')
      expect(data.companies[0]).toHaveProperty('name')
    })
  })

  describe('UI', () => {
    it('renders studios with CompanyRow', async () => {
      renderWithStub()
      expect(await screen.findByText('🎬 Studios')).toBeInTheDocument()

      const companies = await screen.findAllByText('Walt Disney Pictures')
      expect(companies.length).toBeGreaterThan(0)
    })
  })
})
