import { Link } from '@remix-run/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

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
    <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
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

      {/* Page Indicator + Select */}
      <div className='flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-2 shadow-sm'>
        <span className='text-sm text-gray-300'>
          Page {page} of {totalPages}
        </span>

        <Select
          defaultValue={String(page)}
          onValueChange={value => {
            window.location.href = `${basePath}?page=${value}`
          }}
        >
          <SelectTrigger className='w-[80px] rounded-lg bg-white/10 text-sm text-gray-200'>
            <SelectValue placeholder='Page' />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
