// app/routes/auth.login.tsx
import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
  ConfirmationButtons,
  DestructiveButtons,
} from '~/components/common/buttons'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { createRequestToken } from '~/utils/apis/api'

export async function loader({ request }: LoaderFunctionArgs) {
  const result: any = await createRequestToken()
  const request_token = result.request_token
  if (!request_token)
    throw new Response('Failed to get request token', { status: 400 })

  return { request_token, appUrl: process.env.APP_URL }
}

export default function AuthLogin() {
  const { request_token, appUrl } = useLoaderData<typeof loader>()

  function handleApprove() {
    const width = 900
    const height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=${appUrl}/auth/callback`,
      'tmdb-login',
      `width=${width},height=${height},left=${left},top=${top}`,
    )

    const handler = (event: MessageEvent) => {
      if (event.origin !== appUrl) return
      if (event.data === 'tmdb-auth-success') {
        popup?.close()
        window.location.href = '/home'
      }
      if (event.data === 'tmdb-auth-fail') {
        popup?.close()
        window.location.href = '/'
      }
    }

    window.addEventListener('message', handler, { once: true })
  }

  function handleDecline() {
    window.location.href = '/guest'
  }

  return (
    <div className='flex h-screen items-center justify-center bg-inherit'>
      <Card className='w-[600px] rounded-2xl border-0 bg-white/10 p-8 text-inherit shadow-2xl backdrop-blur-lg'>
        <CardHeader>
          <CardTitle>Authorize App</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This application wants to access your <strong>TMDB account </strong>
            to let you save favorites, manage your watchlist, and rate movies.
            Do you approve?
          </p>
        </CardContent>
        <CardFooter className='flex justify-between gap-4'>
          <DestructiveButtons
            onClick={handleDecline}
            type='button'
            text='Decline,Proceed as guest'
          />
          <ConfirmationButtons
            onClick={handleApprove}
            type='button'
            text='Approve with TMDB'
          />
        </CardFooter>
      </Card>
    </div>
  )
}
