// app/routes/auth.callback.tsx
import { createSession, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { createGuestSession } from '~/utils/apis/api'
import { commitSession, getSession } from '~/utils/sessions/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const approvedToken = url.searchParams.get('request_token')

  const session = await getSession(request.headers.get('Cookie'))
  let message = 'tmdb-auth-fail'

  if (!approvedToken) {
    // fallback → guest session
    const { guest_session_id } = await createGuestSession()
    session.set('guest_session_id', guest_session_id)
    return redirect('/main', {
      headers: { 'Set-Cookie': await commitSession(session) },
    })
  }

  const session_id = createSession(approvedToken)

  session.set('session_id', session_id)
  message = 'tmdb-auth-success'

  return new Response(
    `
      <script>
        window.opener.postMessage("${message}", "${process.env.APP_URL}");
        window.close();
      </script>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}
