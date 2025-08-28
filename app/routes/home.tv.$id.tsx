// app/routes/tv.$id.tsx

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import CastComponent, { SimilarComponent } from '~/components/common/movie.body'
import { MovieHero } from '~/components/common/movie.hero'
import { ActionResponse } from '~/types'
import {
  addToWatchlist,
  getAccountDetails,
  getSimilarTvs,
  getTvCredits,
  getTvDetails,
  getTvVideos,
  markAsFavorite,
  rateMedia,
} from '~/utils/apis/api'
import { isAuthenticated } from '~/utils/auth/auth.checker'

export async function loader({ params }: LoaderFunctionArgs) {
  const tvId = params.id
  if (!tvId) throw new Response('Tv-Series not found', { status: 404 })

  const [details, credits, videos, similar] = await Promise.all([
    getTvDetails(tvId),
    getTvCredits(tvId),
    getTvVideos(tvId),
    getSimilarTvs(tvId),
  ])

  return {
    details,
    cast: credits?.cast.slice(0, 10),
    trailer: videos?.results.find(
      (v: any) => v.type === 'Trailer' && v.site === 'YouTube',
    ),
    similar: similar?.results,
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { sessionId, guestId } = await isAuthenticated(request)
  if (!sessionId) return redirect('/')

  const formData = await request.formData()
  const intent = formData.get('intent') as string
  const mediaId = Number(formData.get('mediaId'))
  const mediaType = (formData.get('mediaType') as 'movie' | 'tv') ?? 'movie'

  const account = await getAccountDetails(sessionId)
  let res: ActionResponse | null = null

  if (account?.id) {
    switch (intent) {
      case 'favorite':
        res = await markAsFavorite(
          account.id,
          sessionId,
          mediaId,
          mediaType,
          true,
        )
        if (!res?.success) {
          return { success: false, message: 'Failed to submit rating' }
        }
        return { success: true, message: res.status_message }
        break

      case 'watchlist':
        res = await addToWatchlist(
          account.id,
          sessionId,
          mediaId,
          mediaType,
          true,
        )
        if (!res?.success) {
          return { success: false, message: 'Failed to submit rating' }
        }
        return { success: true, message: res.status_message }
        break

      case 'rate':
        const rating = Number(formData.get('rating'))
        res = await rateMedia(mediaId, sessionId, mediaType, rating)
        if (!res?.success) {
          return { success: false, message: 'Failed to submit rating' }
        }
        return { success: true, message: res.status_message }
        break
    }
  }

  return { success: false, message: 'Account not found' }
}

export default function TvPage() {
  const { details, cast, trailer, similar } = useLoaderData<typeof loader>()
  const { success, message } = useActionData<typeof action>() || {}

  useEffect(() => {
    if (success !== undefined && message) {
      if (success) {
        toast.success(message)
      } else {
        toast.error(message)
      }
    }
  }, [success, message])

  return (
    <div className='min-h-screen'>
      {/* Header Section */}
      <MovieHero details={details} trailer={trailer} type='tv' />

      <div className='mx-auto max-w-[1200px] space-y-6'>
        {/* Cast */}
        <CastComponent cast={cast} />
        {/* Similar Movies */}
        <SimilarComponent similar={similar} baseUrl='/tv/' />
      </div>
    </div>
  )
}
