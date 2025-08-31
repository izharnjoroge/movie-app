// tests/components/navbar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { Navbar } from '~/components/common/navbar'
import { baseLinks, userLinks } from '~/utils/constants/routes'

// --- helper wrapper ---
function withStub(ui: React.ReactNode) {
  const RemixStub = createRemixStub([{ path: '/', Component: () => <>{ui}</> }])
  return <RemixStub initialEntries={['/']} />
}

describe('Navbar', () => {
  it('renders logo that links to /home', () => {
    render(withStub(<Navbar sessionId={null} />))

    const logo = screen.getByText('TMDB')
    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/home')
  })

  it('toggles mobile menu open and close when hamburger clicked', () => {
    render(withStub(<Navbar sessionId={null} />))

    // Initially, dropdown is not visible
    baseLinks.forEach(link => {
      expect(screen.queryByText(link.label)).not.toBeInTheDocument()
    })

    // Open menu
    const toggleBtn = screen.getByRole('button')
    fireEvent.click(toggleBtn)

    baseLinks.forEach(link => {
      expect(screen.getByText(link.label)).toBeInTheDocument()
    })

    // Close menu
    fireEvent.click(toggleBtn)
    baseLinks.forEach(link => {
      expect(screen.queryByText(link.label)).not.toBeInTheDocument()
    })
  })

  it('renders only baseLinks when logged out', () => {
    render(withStub(<Navbar sessionId={null} />))

    fireEvent.click(screen.getByRole('button'))

    baseLinks.forEach(link => {
      expect(screen.getByText(link.label)).toBeInTheDocument()
    })

    userLinks.forEach(link => {
      expect(screen.queryByText(link.label)).not.toBeInTheDocument()
    })

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
  })

  it('renders baseLinks + userLinks when logged in', () => {
    render(withStub(<Navbar sessionId='123' />))

    fireEvent.click(screen.getByRole('button'))

    baseLinks.forEach(link => {
      expect(screen.getByText(link.label)).toBeInTheDocument()
    })

    userLinks.forEach(link => {
      expect(screen.getByText(link.label)).toBeInTheDocument()
    })

    expect(screen.getByText('Logout')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })

  it('closes menu after clicking a link', () => {
    render(withStub(<Navbar sessionId={null} />))

    fireEvent.click(screen.getByRole('button')) // open
    const firstLink = screen.getByText(baseLinks[0].label)

    fireEvent.click(firstLink) // simulate selecting link

    // After clicking, dropdown should be closed
    expect(screen.queryByText(baseLinks[0].label)).not.toBeInTheDocument()
  })
})
