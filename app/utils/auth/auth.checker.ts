import { getSession } from '../sessions/session.server'

export async function isAuthenticated(request: Request): Promise<{
  sessionId: string | null
  guestId: string | null
}> {
  const session = await getSession(request.headers.get('Cookie'))
  const sessionId = session.get('session_id')
  const guestId = session.get('guest_session_id')

  return { sessionId, guestId }
}
