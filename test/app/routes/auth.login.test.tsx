import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRemixStub } from '@remix-run/testing'

import AuthLogin, { loader } from '~/routes/auth.login'
import * as api from '~/utils/apis/api'

describe('AuthLogin route', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // Default API mock
    vi.spyOn(api, 'createRequestToken').mockResolvedValue({
      request_token: 'fake-token',
    })

    // Stub env var
    process.env.APP_URL = 'http://localhost:3000'
  })

  const renderWithStub = () => {
    const RemixStub = createRemixStub([
      { path: '/', Component: AuthLogin, loader },
    ])
    return render(<RemixStub />)
  }

  it('renders authorize app card when token exists', async () => {
    renderWithStub()
    expect(await screen.findByText(/authorize app/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /decline,proceed as guest/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /approve with tmdb/i }),
    ).toBeInTheDocument()
  })

  it('shows error boundary if no token is returned', async () => {
    vi.spyOn(api, 'createRequestToken').mockResolvedValue({}) // no token

    renderWithStub()

    // Loader throws → error boundary should render
    expect(await screen.findByText(/application error/i)).toBeInTheDocument()
  })

  it('navigates to /guest on decline', async () => {
    const user = userEvent.setup()
    delete (window as any).location
    ;(window as any).location = { href: '' }

    renderWithStub()

    const declineBtn = await screen.findByRole('button', {
      name: /decline,proceed as guest/i,
    })
    await user.click(declineBtn)

    expect(window.location.href).toBe('/guest')
  })

  it('approves with TMDB and handles success message', async () => {
    const user = userEvent.setup()

    // Mock window.open
    const popup: any = { close: vi.fn() }
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(popup)

    delete (window as any).location
    ;(window as any).location = { href: '' }

    renderWithStub()

    const approveBtn = await screen.findByRole('button', {
      name: /approve with tmdb/i,
    })
    await user.click(approveBtn)

    // Simulate TMDB success
    const event = new MessageEvent('message', {
      origin: 'http://localhost:3000',
      data: 'tmdb-auth-success',
    })
    window.dispatchEvent(event)

    await waitFor(() => {
      expect(popup.close).toHaveBeenCalled()
      expect(window.location.href).toBe('/home')
    })

    openSpy.mockRestore()
  })

  it('approves with TMDB and handles failure message', async () => {
    const user = userEvent.setup()

    const popup: any = { close: vi.fn() }
    vi.spyOn(window, 'open').mockReturnValue(popup)

    delete (window as any).location
    ;(window as any).location = { href: '' }

    renderWithStub()

    const approveBtn = await screen.findByRole('button', {
      name: /approve with tmdb/i,
    })
    await user.click(approveBtn)

    // Simulate TMDB failure
    const event = new MessageEvent('message', {
      origin: 'http://localhost:3000',
      data: 'tmdb-auth-fail',
    })
    window.dispatchEvent(event)

    await waitFor(() => {
      expect(popup.close).toHaveBeenCalled()
      expect(window.location.href).toBe('/')
    })
  })
})
