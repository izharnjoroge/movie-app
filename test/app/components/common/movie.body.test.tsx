// tests/components/carousel.cast-similar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import { CastComponent, SimilarComponent } from '~/components/common/movie.body'
import { MovieCredits } from '~/types'
import { movieComponentResponse } from '../features/main/main.features.test'

export const creditsComponent: MovieCredits = {
  id: 911480,
  cast: [
    {
      adult: false,
      gender: 2,
      id: 116514,
      known_for_department: 'Acting',
      name: 'Eric Lange',
      original_name: 'Eric Lange',
      popularity: 0.8432,
      profile_path: '/ziOcfPKJ5jjyUikOOoCfjusy0Ut.jpg',
      cast_id: 243,
      character: 'Houston',
      credit_id: '681189478382b9d14e567770',
      order: 13,
    },
  ],
  crew: [],
}

// --- helper to wrap components with RemixStub ---
function withStub(ui: React.ReactNode) {
  const RemixStub = createRemixStub([{ path: '/', Component: () => <>{ui}</> }])
  return <RemixStub initialEntries={['/']} />
}

describe('CastComponent', () => {
  it('renders nothing when cast is empty', () => {
    const { container } = render(withStub(<CastComponent cast={[]} />))
    expect(container.firstChild).toBeNull()
  })

  it('renders actors when cast is provided', async () => {
    render(withStub(<CastComponent cast={creditsComponent.cast} />))

    const actor = await screen.findAllByText('Eric Lange')
    expect(actor.length).toBeGreaterThan(0)

    expect(screen.getByText('Houston')).toBeInTheDocument()
    expect(screen.getByText('Top Cast')).toBeInTheDocument()
  })
})

describe('SimilarComponent', () => {
  it('renders nothing when similar is empty', () => {
    const { container } = render(
      withStub(<SimilarComponent similar={[]} baseUrl='/movie/' />),
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders similar movies with links', () => {
    render(
      withStub(
        <SimilarComponent
          similar={movieComponentResponse.results}
          baseUrl='/movie/'
        />,
      ),
    )

    expect(screen.getByText('Similar')).toBeInTheDocument()

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/home/movie/755898')
  })
})
