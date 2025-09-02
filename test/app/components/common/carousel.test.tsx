// tests/components/carousel.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { ManualCarousel } from '~/components/common/carousel'

// helper wrapper
function withStub(ui: React.ReactNode) {
  const RemixStub = createRemixStub([{ path: '/', Component: () => <>{ui}</> }])
  return <RemixStub initialEntries={['/']} />
}

describe('ManualCarousel', () => {
  const items = ['One', 'Two', 'Three']

  it('returns null when no items provided', () => {
    const { container } = render(
      withStub(<ManualCarousel items={[]} renderItem={() => <div />} />),
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the first item initially', () => {
    render(
      withStub(
        <ManualCarousel
          items={items}
          renderItem={item => <div data-testid='slide'>{item}</div>}
        />,
      ),
    )

    expect(screen.getByTestId('slide')).toHaveTextContent('One')
  })

  //   it('navigates to next and prev slides', () => {
  //     render(
  //       withStub(
  //         <ManualCarousel
  //           items={items}
  //           renderItem={item => <div data-testid='slide'>{item}</div>}
  //         />,
  //       ),
  //     )

  //     const nextButton = screen.getByRole('button', { name: '' })
  //     fireEvent.click(nextButton)
  //     expect(screen.getByTestId('slide')).toHaveTextContent('Two')

  //     const prevButton = screen.getByRole('button', { name: '' })
  //     fireEvent.click(prevButton)
  //     expect(screen.getByTestId('slide')).toHaveTextContent('One')
  //   })

  it('cycles around when reaching the end', () => {
    render(
      withStub(
        <ManualCarousel
          items={items}
          renderItem={item => <div data-testid='slide'>{item}</div>}
        />,
      ),
    )

    const nextButton = screen.getAllByRole('button')[1]
    fireEvent.click(nextButton)
    fireEvent.click(nextButton)
    fireEvent.click(nextButton)
    expect(screen.getByTestId('slide')).toHaveTextContent('One')
  })

  it('changes slide when clicking dot indicators', () => {
    render(
      withStub(
        <ManualCarousel
          items={items}
          renderItem={item => <div data-testid='slide'>{item}</div>}
        />,
      ),
    )

    const dots = screen.getAllByRole('button')
    fireEvent.click(dots[0])
    expect(screen.getByTestId('slide')).toHaveTextContent('Three')
  })
})
