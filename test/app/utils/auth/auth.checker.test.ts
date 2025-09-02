// isAuthenticated.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isAuthenticated } from '~/utils/auth/auth.checker'
import { getSession } from '~/utils/sessions/session.server'

// Mock getSession from where it’s imported
vi.mock('~/utils/sessions/session.server', () => ({
  getSession: vi.fn(),
}))

describe('isAuthenticated', () => {
  const mockRequest = (cookie: string | null) =>
    new Request('http://localhost', {
      headers: cookie ? { Cookie: cookie } : {},
    })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns sessionId and guestId when session contains both', async () => {
    ;(getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      get: (key: string) => {
        if (key === 'session_id') return 'session-123'
        if (key === 'guest_session_id') return 'guest-456'
        return null
      },
    })

    const result = await isAuthenticated(mockRequest('cookie=value'))
    expect(result).toEqual({ sessionId: 'session-123', guestId: 'guest-456' })
  })

  it('returns nulls if session values are missing', async () => {
    ;(getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      get: () => null,
    })

    const result = await isAuthenticated(mockRequest(null))
    expect(result).toEqual({ sessionId: null, guestId: null })
  })

  it('returns only sessionId if guestId is missing', async () => {
    ;(getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      get: (key: string) => (key === 'session_id' ? 'session-abc' : null),
    })

    const result = await isAuthenticated(mockRequest('cookie=value'))
    expect(result).toEqual({ sessionId: 'session-abc', guestId: null })
  })
})
