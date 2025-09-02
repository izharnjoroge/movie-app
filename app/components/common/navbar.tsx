//app.components.common.navbar.tsx
import { useState } from 'react'
import { Link, NavLink } from '@remix-run/react'
import { baseLinks, userLinks } from '~/utils/constants/routes'
import { Menu, X } from 'lucide-react'

export function Navbar({ sessionId }: { sessionId: string | null }) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = sessionId ? [...baseLinks, ...userLinks] : baseLinks

  return (
    <nav className='fixed left-0 top-0 z-10 w-full max-w-[1980px] rounded-b-lg bg-white/10 shadow backdrop-blur-md'>
      <div className='flex items-center justify-between px-6 py-3'>
        {/* Logo */}
        <Link to='/home' className='text-xl font-bold'>
          TMDB
        </Link>

        {/* Mobile Hamburger */}
        <button
          className='rounded p-2 hover:bg-white/20'
          onClick={() => setIsOpen(prev => !prev)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className='flex flex-col items-end gap-2 bg-black/70 px-6 pb-4'>
          {navItems.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={false}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `max-w-[200px] rounded-md px-3 py-2 ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-500/50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {sessionId ? (
            <>
              <NavLink
                to='/auth/logout'
                onClick={() => setIsOpen(false)}
                className='max-w-[200px] rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700'
              >
                Logout
              </NavLink>
            </>
          ) : (
            <NavLink
              to='/auth/login'
              onClick={() => setIsOpen(false)}
              className='max-w-[200px] rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700'
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  )
}
