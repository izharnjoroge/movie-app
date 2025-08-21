import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Index from '~/routes/_index'

describe('Index Route', () => {
  it('renders the welcome message', () => {
    render(<Index />)

    expect(screen.getByText('Quick Start (5 min)')).toBeInTheDocument()
  })
})
