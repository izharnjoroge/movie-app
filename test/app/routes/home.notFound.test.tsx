// tests/routes/notfound.test.tsx
import { screen, render } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import NotFoundPage from '~/routes/$'
import { describe, it, expect } from 'vitest'

describe('NotFoundPage', () => {
  function renderWithStub(initialPath = '/does-not-exist') {
    const RemixStub = createRemixStub([
      {
        path: '*',
        Component: NotFoundPage,
      },
    ])
    return render(<RemixStub initialEntries={[initialPath]} />)
  }

  it('renders 404 message', async () => {
    renderWithStub()
    expect(await screen.findByText('404')).toBeInTheDocument()
    expect(await screen.findByText(/doesn’t exist/i)).toBeInTheDocument()
  })

  it('renders link back to movies', async () => {
    renderWithStub()
    const link = await screen.findByRole('link', { name: /back to movies/i })
    expect(link).toHaveAttribute('href', '/home')
  })
})
