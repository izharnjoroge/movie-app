// tests/components/sectionwrapper.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionWrapper } from '~/components/common/section.wrapper'

describe('SectionWrapper', () => {
  it('renders children correctly', () => {
    render(
      <SectionWrapper>
        <p>Wrapped content</p>
      </SectionWrapper>,
    )

    expect(screen.getByText('Wrapped content')).toBeInTheDocument()
  })

  it('renders as a <section> element', () => {
    const { container } = render(
      <SectionWrapper>
        <div>Test</div>
      </SectionWrapper>,
    )

    const section = container.querySelector('section')
    expect(section).not.toBeNull()
  })

  it('applies the expected class names', () => {
    const { container } = render(
      <SectionWrapper>
        <span>Test</span>
      </SectionWrapper>,
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass(
      'md:pt-18',
      'mx-auto',
      'min-h-screen',
      'max-w-[1200px]',
      'px-4',
      'pb-10',
      'pt-[100px]',
      'text-white',
      'lg:px-0',
    )
  })
})
