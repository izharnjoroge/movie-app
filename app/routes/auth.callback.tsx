// app/routes/auth.callback.tsx
import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { createGuestSession, createSession } from '~/utils/apis/api'
import { commitSession, getSession } from '~/utils/sessions/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const approvedToken = url.searchParams.get('request_token')
  const denied = url.searchParams.get('denied')

  const session = await getSession(request.headers.get('Cookie'))
  let message = 'tmdb-auth-fail'

  if (denied === 'true') {
    return new Response(
      `
      <script>
        window.opener.postMessage("${message}", "*");
        window.close();
      </script>
    `,
      { headers: { 'Content-Type': 'text/html' } },
    )
  }

  if (!approvedToken) {
    // fallback → guest session
    const guest_session_id = await createGuestSession()
    session.set('guest_session_id', guest_session_id)
    return redirect('/home', {
      headers: { 'Set-Cookie': await commitSession(session) },
    })
  }

  const { session_id, success } = await createSession(approvedToken)

  if (success) {
    session.set('session_id', session_id)
    message = 'tmdb-auth-success'

    return new Response(
      `
      <script>
        window.opener.postMessage("${message}", "${process.env.NODE_ENV == 'development' ? process.env.APP_URL : '*'}");
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
  return new Response(
    `
    <script>
      window.opener.postMessage("${message}", "*");
      window.close();
    </script>
  `,
    { headers: { 'Content-Type': 'text/html' } },
  )
}
