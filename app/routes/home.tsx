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
