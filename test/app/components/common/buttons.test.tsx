// tests/components/buttons.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import {
  ConfirmationButtons,
  DestructiveButtons,
  OutlinedButtons,
} from '~/components/common/buttons'

// --- helper wrapper using RemixStub ---
function withStub(ui: React.ReactNode) {
  const RemixStub = createRemixStub([{ path: '/', Component: () => <>{ui}</> }])
  return <RemixStub initialEntries={['/']} />
}

describe('Buttons', () => {
  it('renders ConfirmationButtons with text prop', () => {
    const handleClick = vi.fn()
    render(
      withStub(<ConfirmationButtons text='Confirm' onClick={handleClick} />),
    )

    const btn = screen.getByRole('button', { name: 'Confirm' })
    expect(btn).toBeInTheDocument()

    fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders DestructiveButtons with children instead of text', () => {
    const handleClick = vi.fn()
    render(
      withStub(
        <DestructiveButtons onClick={handleClick}>
          Delete Item
        </DestructiveButtons>,
      ),
    )

    const btn = screen.getByRole('button', { name: 'Delete Item' })
    expect(btn).toBeInTheDocument()

    fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders OutlinedButtons correctly', () => {
    const handleClick = vi.fn()
    render(withStub(<OutlinedButtons text='Outline' onClick={handleClick} />))

    const btn = screen.getByRole('button', { name: 'Outline' })
    expect(btn).toBeInTheDocument()

    fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalled()
  })
})
