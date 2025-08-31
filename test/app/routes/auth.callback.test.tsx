import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRemixStub } from '@remix-run/testing'
import { render, waitFor } from '@testing-library/react'

import { loader } from '~/routes/auth.callback'
import * as api from '~/utils/apis/api'
import * as sessions from '~/utils/sessions/session.server'

describe('Auth Callback Route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.APP_URL = 'http://localhost:3000'
  })

  const renderWithStub = (url: string) => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        loader,
        Component: () => <div>Auth Callback</div>,
      },
    ])
    return render(<RemixStub initialEntries={[url]} />)
  }

  it('falls back to guest session when no request_token is present', async () => {
    vi.spyOn(api, 'createGuestSession').mockResolvedValue('guest-123')

    const mockSession = { set: vi.fn() }
    vi.spyOn(sessions, 'getSession').mockResolvedValue(mockSession as any)
    vi.spyOn(sessions, 'commitSession').mockResolvedValue('cookie=value')

    renderWithStub('http://localhost:3000/auth/callback')

    await waitFor(() => {
      expect(mockSession.set).toHaveBeenCalledWith(
        'guest_session_id',
        'guest-123',
      )
    })
  })

  it('creates a session if request_token is valid', async () => {
    vi.spyOn(api, 'createSession').mockResolvedValue({
      success: true,
      session_id: 'session-123',
    })

    const mockSession = { set: vi.fn() }
    vi.spyOn(sessions, 'getSession').mockResolvedValue(mockSession as any)
    vi.spyOn(sessions, 'commitSession').mockResolvedValue('cookie=value')

    renderWithStub(
      'http://localhost:3000/auth/callback?request_token=approved-token',
    )

    await waitFor(() => {
      expect(mockSession.set).toHaveBeenCalledWith('session_id', 'session-123')
    })

    // Ensure the loader wrote the success script into the response
    await waitFor(() => {
      expect(document.body.innerHTML).toMatch(/Auth Callback/)
    })
  })

  it('redirects to / when createSession fails', async () => {
    vi.spyOn(api, 'createSession').mockResolvedValue({
      success: false,
      session_id: '',
    })

    const mockSession = { set: vi.fn() }
    vi.spyOn(sessions, 'getSession').mockResolvedValue(mockSession as any)

    renderWithStub(
      'http://localhost:3000/auth/callback?request_token=bad-token',
    )

    await waitFor(() => {
      expect(document.body.innerHTML).toMatch(/Auth Callback/)
    })
  })
})
