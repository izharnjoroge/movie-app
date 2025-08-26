// app/routes/home.tsx
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { getSession } from '~/utils/sessions/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const sessionId = session.get('session_id')
  const guestId = session.get('guest_session_id')

  if (!sessionId && !guestId) return redirect('/')

  return { sessionId, guestId }
}

export default function MainWrapper() {
  const { sessionId } = useLoaderData<typeof loader>()

  const baseLinks = [
    { to: '/home/studios', label: 'Studios' },
    { to: '/home/movies', label: 'Movies' },
    { to: '/home/tv', label: 'TV Series' },
  ]

  // Extra links only for logged in users
  const userLinks = [
    { to: '/home/watch-list', label: 'Watchlist' },
    { to: '/home/favorites', label: 'Favorites' },
    { to: '/home/recommendations', label: 'Recommendations' },
    { to: '/home/ratings', label: 'My Ratings' },
  ]

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-black text-white'>
      {/* Navbar */}
      <nav className='flex items-center justify-between bg-white/10 px-6 py-4 shadow'>
        <Link to={'/home'} className='text-xl font-bold'>
          🎬 My TMDB App
        </Link>

        <div className='flex gap-4'>
          {baseLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 ${
                  isActive ? 'bg-blue-600' : 'hover:bg-blue-500/50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {sessionId &&
            userLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 ${
                    isActive ? 'bg-green-600' : 'hover:bg-green-500/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </div>
      </nav>

      {/* Page Content */}
      <main className='flex-1 p-6'>
        <Outlet />
      </main>
    </div>
  )
}
