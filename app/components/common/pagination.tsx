import { Link } from '@remix-run/react'

export function PaginationComponent({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) {
  return (
    <div className='mt-10 flex items-center justify-center gap-4'>
      {/* Prev Button */}
      <Link
        to={page > 1 ? `${basePath}?page=${page - 1}` : '#'}
        aria-disabled={page === 1}
        className={`rounded-2xl px-4 py-2 text-white shadow-sm transition ${
          page === 1
            ? 'pointer-events-none cursor-not-allowed bg-gray-500 opacity-50'
            : 'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        ⬅ Prev
      </Link>

      {/* Next Button */}
      <Link
        to={page < totalPages ? `${basePath}?page=${page + 1}` : '#'}
        aria-disabled={page === totalPages}
        className={`rounded-2xl px-4 py-2 text-white shadow-sm transition ${
          page === totalPages
            ? 'pointer-events-none cursor-not-allowed bg-gray-500 opacity-50'
            : 'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        Next ➡
      </Link>
    </div>
  )
}
