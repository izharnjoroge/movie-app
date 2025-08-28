import { Form, useNavigate } from '@remix-run/react'
import { Button } from '../ui/button'
import { useRef } from 'react'

export function SearchForm({
  placeholder = 'Search movies...',
  baseUrl = '/home/movies',
}: {
  placeholder?: string
  baseUrl?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '' // clear input value
    }
    navigate(baseUrl) // reset to base route
  }

  return (
    <Form method='post' className='mb-6 flex gap-2'>
      <input
        ref={inputRef}
        type='text'
        name='query'
        placeholder={placeholder}
        className='flex-1 rounded-lg border border-gray-600 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none'
      />

      <Button
        type='submit'
        className='rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700'
      >
        Search
      </Button>

      <Button
        type='button'
        onClick={handleClear}
        className='rounded-lg border-2 border-white/80 px-4 py-2 text-sm font-semibold text-cyan-600 transition'
      >
        Clear
      </Button>
    </Form>
  )
}
