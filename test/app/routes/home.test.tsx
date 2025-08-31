// tests/routes/home.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { describe, it, expect, vi } from 'vitest'
import * as authChecker from '~/utils/auth/auth.checker'
import Home, { loader as homeLoader } from '~/routes/home'

// Stub Navbar since it's not under test
vi.mock('~/components/common/navbar', () => ({
  Navbar: ({ sessionId }: { sessionId: string }) => (
    <div>Navbar - session: {sessionId}</div>
  ),
}))

describe('Home route', () => {
  function renderWithStub() {
    const RemixStub = createRemixStub([
      {
        path: '/home',
        Component: Home,
        loader: homeLoader,
        children: [
          {
            path: '',
            Component: () => <div>Child Page</div>,
          },
        ],
      },
    ])
    return render(<RemixStub initialEntries={['/home']} />)
  }

  it('redirects if unauthenticated', async () => {
    vi.spyOn(authChecker, 'isAuthenticated').mockResolvedValue({
      sessionId: null,
      guestId: null,
    })

    renderWithStub()

    // RemixStub surfaces redirect → Application Error
    await waitFor(() =>
      expect(screen.getByText(/application error/i)).toBeInTheDocument(),
    )
  })

  it('renders Navbar and outlet when authenticated with sessionId', async () => {
    vi.spyOn(authChecker, 'isAuthenticated').mockResolvedValue({
      sessionId: 'abc-123',
      guestId: null,
    })

    renderWithStub()

    expect(
      await screen.findByText(/navbar - session: abc-123/i),
    ).toBeInTheDocument()
    expect(await screen.findByText('Child Page')).toBeInTheDocument()
  })

  it('renders Navbar and outlet when authenticated with guestId', async () => {
    vi.spyOn(authChecker, 'isAuthenticated').mockResolvedValue({
      sessionId: null,
      guestId: 'guest-999',
    })

    renderWithStub()

    expect(await screen.findByText(/navbar - session/i)).toBeInTheDocument()
    expect(await screen.findByText('Child Page')).toBeInTheDocument()
  })
})
