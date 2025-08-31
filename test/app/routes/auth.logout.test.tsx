import { describe, it, expect, vi } from 'vitest'
import { loader } from '~/routes/auth.logout'
import * as sessions from '~/utils/sessions/session.server'

describe('auth.logout loader', () => {
  it('destroys session and redirects to /', async () => {
    const mockSession = { id: 'session-123' }
    vi.spyOn(sessions, 'getSession').mockResolvedValue(mockSession as any)
    vi.spyOn(sessions, 'destroySession').mockResolvedValue('cookie=deleted')

    const request = new Request('http://localhost/auth/logout', {
      headers: { Cookie: 'session=abc' },
    })

    const response = await loader({ request })

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('/')
    expect(response.headers.get('Set-Cookie')).toBe('cookie=deleted')
  })
})
