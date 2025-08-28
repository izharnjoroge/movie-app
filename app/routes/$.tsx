// app/routes/$.tsx
import { Link } from '@remix-run/react'

export default function NotFoundPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-black text-center text-white'>
      <h1 className='mb-4 text-6xl font-bold'>404</h1>
      <p className='mb-6 text-lg text-gray-400'>
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to='/home'
        className='rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-700'
      >
        ⬅ Back to Movies
      </Link>
    </div>
  )
}
