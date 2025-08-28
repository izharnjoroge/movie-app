import { redirect } from '@remix-run/node'
import { destroySession, getSession } from '~/utils/sessions/session.server'

export async function loader({ request }: { request: Request }) {
  const session = await getSession(request.headers.get('Cookie'))
  //   session.unset('session_id')
  //   session.unset('guest_session_id')

  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}
