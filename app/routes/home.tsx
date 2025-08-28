// app/routes/home.tsx
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Navbar } from '~/components/common/navbar'
import { isAuthenticated } from '~/utils/auth/auth.checker'

export async function loader({ request }: LoaderFunctionArgs) {
  const { sessionId, guestId } = await isAuthenticated(request)
  if (!sessionId && !guestId) {
    return redirect('/')
  }
  return { sessionId, guestId }
}

export default function MainWrapper() {
  const { sessionId } = useLoaderData<typeof loader>()

  return (
    <div className='min-h-screen text-white'>
      {/* Navbar */}
      <Navbar sessionId={sessionId} />

      {/* Page Content */}
      <Outlet />
    </div>
  )
}

// Remix-style error boundary
export function ErrorBoundary({ error }: { error: unknown }) {
  // Normalize error (Remix sometimes passes `unknown`)
  let message = 'An unexpected error occurred'
  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  } else if (error && typeof error === 'object' && 'statusText' in error) {
    message = (error as any).statusText || message
  }

  useEffect(() => {
    toast.error(message, {
      action: {
        label: 'Reload',
        onClick: () => location.reload(),
      },
    })
  }, [message])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-6 text-center text-white'>
      <h1 className='mb-4 text-2xl font-bold'>Something went wrong</h1>
      <p className='mb-6 text-gray-400'>{message}</p>
    </div>
  )
}
