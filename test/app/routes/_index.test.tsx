import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LandingPage, { loader, action } from '~/routes/_index'
import * as authChecker from '~/utils/auth/auth.checker'
import * as api from '~/utils/apis/api'
import * as sessions from '~/utils/sessions/session.server'
import { redirect } from '@remix-run/node'

describe('Index Route', () => {
  it('renders the welcome message', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /welcome to the tmdb app/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/discover movies/i)).toBeInTheDocument()
  })
})

describe('loader()', () => {
  it('redirects if user is authenticated', async () => {
    vi.spyOn(authChecker, 'isAuthenticated').mockResolvedValue({
      sessionId: '123',
      guestId: null,
    })

    const response = await loader({ request: new Request('http://localhost') })
    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('/home')
  })

  it('returns empty object if unauthenticated', async () => {
    vi.spyOn(authChecker, 'isAuthenticated').mockResolvedValue({
      sessionId: null,
      guestId: null,
    })

    const response = await loader({ request: new Request('http://localhost') })
    expect(response).toEqual({})
  })
})

describe('action()', () => {
  it('creates guest session and redirects', async () => {
    vi.spyOn(api, 'createGuestSession').mockResolvedValue('guest-123')
    const mockSession = {
      set: vi.fn(),
    }
    vi.spyOn(sessions, 'getSession').mockResolvedValue(mockSession as any)
    vi.spyOn(sessions, 'commitSession').mockResolvedValue('cookie=value')

    const response = await action({ request: new Request('http://localhost') })

    expect(mockSession.set).toHaveBeenCalledWith(
      'guest_session_id',
      'guest-123',
    )
    expect(response.status).toBe(302)
    expect(response.headers.get('Set-Cookie')).toBe('cookie=value')
    expect(response.headers.get('Location')).toBe('/home')
  })

  it('throws if guest session fails', async () => {
    vi.spyOn(api, 'createGuestSession').mockResolvedValue(null)

    await expect(
      action({ request: new Request('http://localhost') }),
    ).rejects.toMatchObject({ status: 400 })
  })
})
