import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRemixStub } from '@remix-run/testing'

import LandingPage, { loader, action } from '~/routes/_index'
import * as authChecker from '~/utils/auth/auth.checker'
import * as api from '~/utils/apis/api'
import * as sessions from '~/utils/sessions/session.server'

describe('LandingPage route', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // Default: unauthenticated so <LandingPage /> renders
    vi.spyOn(authChecker, 'isAuthenticated').mockResolvedValue({
      sessionId: null,
      guestId: null,
    })
  })

  const renderWithStub = () => {
    const RemixStub = createRemixStub([
      { path: '/', Component: LandingPage, loader, action },
      { path: '/home', Component: () => <div>Home Page</div> },
    ])
    return render(<RemixStub />)
  }

  it('renders welcome message', async () => {
    renderWithStub()

    expect(
      await screen.findByRole('heading', { name: /welcome to the tmdb app/i }),
    ).toBeInTheDocument()
  })

  it('redirects if authenticated', async () => {
    vi.spyOn(authChecker, 'isAuthenticated').mockResolvedValue({
      sessionId: '123',
      guestId: null,
    })

    renderWithStub()

    expect(await screen.findByText('Home Page')).toBeInTheDocument()
  })

  it('submits guest login form', async () => {
    const user = userEvent.setup()

    // Mock session creation
    vi.spyOn(api, 'createGuestSession').mockResolvedValue('guest-123')
    const mockSession = { set: vi.fn() }
    vi.spyOn(sessions, 'getSession').mockResolvedValue(mockSession as any)
    vi.spyOn(sessions, 'commitSession').mockResolvedValue('cookie=value')

    renderWithStub()

    const guestButton = await screen.findByRole('button', {
      name: /continue as guest/i,
    })
    await user.click(guestButton)

    await waitFor(() => {
      expect(mockSession.set).toHaveBeenCalledWith(
        'guest_session_id',
        'guest-123',
      )
    })
  })
})
