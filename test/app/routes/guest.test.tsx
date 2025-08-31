import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRemixStub } from '@remix-run/testing'
import { render, waitFor } from '@testing-library/react'
import { loader } from '~/routes/guest'
import * as sessions from '~/utils/sessions/session.server'

describe('Auth Guest Route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.API_KEY = 'fake-api-key'
  })

  const renderWithStub = () => {
    const RemixStub = createRemixStub([
      { path: '/', loader, Component: () => <div>Guest Redirect</div> },
    ])
    return render(<RemixStub />)
  }

  it('creates a guest session and sets cookie', async () => {
    const data = { success: true, guest_session_id: 'guest-123' }

    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => data,
    } as any)

    const mockSession = { set: vi.fn() }
    vi.spyOn(sessions, 'getSession').mockResolvedValue(mockSession as any)
    vi.spyOn(sessions, 'commitSession').mockResolvedValue('cookie=value')

    const response = await loader({ request: new Request('http://localhost/') })

    expect(mockSession.set).toHaveBeenCalledWith(
      'guest_session_id',
      'guest-123',
    )
    expect(response.headers.get('Set-Cookie')).toBe('cookie=value')
    expect(response.status).toBe(302) // redirect
  })

  it('throws an error if API call fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ success: false }),
    } as any)

    const mockSession = { set: vi.fn() }
    vi.spyOn(sessions, 'getSession').mockResolvedValue(mockSession as any)

    renderWithStub()

    await waitFor(() => {
      expect(document.body.innerHTML).toMatch(/application error/i)
    })
  })
})
