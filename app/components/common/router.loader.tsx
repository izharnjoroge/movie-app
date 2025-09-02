//app.components.common.movie.card.tsx
import { useNavigation } from '@remix-run/react'
import { Loader2 } from 'lucide-react'

export const RouteLoader = () => {
  const navigation = useNavigation()

  const isSubmitting =
    navigation.state === 'submitting' || navigation.state === 'loading'
  return (
    <>
      {isSubmitting && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cyan-900 to-black/70 backdrop-blur-0'>
          <Loader2 className='h-12 w-12 animate-spin' />
        </div>
      )}
    </>
  )
}
