//guest.tsx
import { redirect } from '@remix-run/node'
import { commitSession, getSession } from '~/utils/sessions/session.server'

export async function loader({ request }: { request: Request }) {
  const res = await fetch(
    `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${process.env.API_KEY}`,
  )
  const data = await res.json()

  if (!data.success) {
    throw new Response('Failed to create guest session', { status: 400 })
  }

  const session = await getSession(request.headers.get('Cookie'))
  session.set('guest_session_id', data.guest_session_id)

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
