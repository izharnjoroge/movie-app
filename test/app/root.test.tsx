// test/app/root.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App, { ErrorBoundary, Layout, links } from '~/root'
import { toast } from 'sonner'
import { createRemixStub } from '@remix-run/testing'

// 🔧 Mock sonner’s toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
  Toaster: () => <div data-testid='toaster' />,
}))

describe('root.tsx', () => {
  it('links() returns Google Fonts preconnect + stylesheet', () => {
    const result = links()
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        }),
        expect.objectContaining({
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
        }),
        expect.objectContaining({
          rel: 'stylesheet',
          href: expect.stringContaining('fonts.googleapis.com/css2'),
        }),
      ]),
    )
  })

  it('App renders an <Outlet>', () => {
    render(<App />)
    // Nothing visible by default, but Outlet mounts without crash
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument()
  })

  describe('ErrorBoundary', () => {
    it('renders error message from Error object and triggers toast', () => {
      const error = new Error('Boom!')
      render(<ErrorBoundary error={error} />)

      expect(screen.getByText('Boom!')).toBeInTheDocument()
      expect(toast.error).toHaveBeenCalledWith('Boom!', expect.any(Object))
    })

    it('renders error message from string', () => {
      render(<ErrorBoundary error='String failure' />)
      expect(screen.getByText('String failure')).toBeInTheDocument()
    })

    it('renders statusText from error-like object', () => {
      render(<ErrorBoundary error={{ statusText: 'Not Found' }} />)
      expect(screen.getByText('Not Found')).toBeInTheDocument()
    })

    it('renders fallback message for unknown error', () => {
      render(<ErrorBoundary error={1234} />)
      expect(
        screen.getByText('An unexpected error occurred'),
      ).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('wraps children inside full document', async () => {
      const RemixStub = createRemixStub([
        {
          path: '/',
          Component: () => (
            <Layout>
              <h1>Child Content</h1>
            </Layout>
          ),
        },
      ])

      render(<RemixStub />)

      // assert DOM structure
      expect(document.querySelector('html')).toBeTruthy()
      expect(document.querySelector('head meta[charset="utf-8"]')).toBeTruthy()
      expect(
        screen.getByRole('heading', { name: /child content/i }),
      ).toBeInTheDocument()
    })
  })
})
