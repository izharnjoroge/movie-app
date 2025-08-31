import {
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { Form } from '@remix-run/react'
import {
  ConfirmationButtons,
  OutlinedButtons,
} from '~/components/common/buttons'
import { createGuestSession } from '~/utils/apis/api'
import { isAuthenticated } from '~/utils/auth/auth.checker'
import { getSession, commitSession } from '~/utils/sessions/session.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to The Movie App!' },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { sessionId, guestId } = await isAuthenticated(request)

  if (sessionId || guestId) {
    return redirect('/home')
  }
  return {}
}

export async function action({ request }: LoaderFunctionArgs) {
  const guest_session_id = await createGuestSession()
  if (!guest_session_id)
    throw new Response('Failed to create guest session', { status: 400 })

  const session = await getSession(request.headers.get('Cookie'))
  session.set('guest_session_id', guest_session_id)

  return redirect('/home', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}

export default function LandingPage() {
  return (
    <div className='flex h-screen items-center justify-center bg-inherit p-6'>
      <div className='w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg'>
        <h1 className='mb-6 text-center text-3xl font-bold text-white'>
          🎬 Welcome to The TMDB App
        </h1>
        <p className='mb-8 text-center text-blue-100'>
          Discover movies, track favorites, and explore as a guest or with your
          TMDB account.
        </p>

        <div className='flex flex-col gap-4'>
          {/* Guest session flow */}
          <Form method='post' action='?index'>
            <OutlinedButtons text='Continue as Guest' type='submit' />
          </Form>

          {/* User session flow */}
          <Form method='get' action='/auth/login'>
            <ConfirmationButtons text='Login with TMDB' type='submit' />
          </Form>
        </div>
      </div>
    </div>
  )
}
