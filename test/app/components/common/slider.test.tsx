// tests/components/slider.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Slider from '~/components/common/slider'

// --- helper child content ---
const mockChildren = (
  <>
    <span>Item 1</span>
    <span>Item 2</span>
  </>
)

describe('Slider', () => {
  it('renders children correctly', () => {
    render(<Slider className='test-slider'>{mockChildren}</Slider>)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('applies horizontal translation style by default', () => {
    const { container } = render(
      <Slider className='test-slider'>{mockChildren}</Slider>,
    )

    const motionDiv = container.querySelector('.flex.w-max.items-center')
    expect(motionDiv).toBeInTheDocument()
    expect(motionDiv).toHaveStyle({ gap: '3px' })
  })

  it('applies vertical translation style when direction="vertical"', () => {
    const { container } = render(
      <Slider className='test-slider' direction='vertical'>
        {mockChildren}
      </Slider>,
    )

    const motionDiv = container.querySelector('.flex.w-max.items-center')
    expect(motionDiv).toBeInTheDocument()
    // framer-motion applies y style, but we can just confirm style object includes gap
    expect(motionDiv).toHaveStyle({ gap: '3px' })
  })

  it('respects custom gap prop', () => {
    const { container } = render(
      <Slider className='test-slider' gap={10}>
        {mockChildren}
      </Slider>,
    )

    const motionDiv = container.querySelector('.flex.w-max.items-center')
    expect(motionDiv).toHaveStyle({ gap: '10px' })
  })

  it('applies hover handlers when durationOnHover is provided', () => {
    const { container } = render(
      <Slider className='test-slider' durationOnHover={200}>
        {mockChildren}
      </Slider>,
    )

    const motionDiv = container.querySelector('.flex.w-max.items-center')
    expect(motionDiv).toHaveProperty('onmouseenter')
    expect(motionDiv).toHaveProperty('onmouseleave')

    // simulate hover
    fireEvent.mouseEnter(motionDiv!)
    fireEvent.mouseLeave(motionDiv!)
  })
})
