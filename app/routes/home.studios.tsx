// app/routes/studios.tsx
import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { CompanyRow } from '~/components/features/main/main.features'
import { Company } from '~/types'
import { getCompanyDetails } from '~/utils/apis/api'
import { STUDIOS } from '~/utils/constants/studios'
import { getSession } from '~/utils/sessions/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const sessionId = session.get('session_id')
  const guestId = session.get('guest_session_id')

  if (!sessionId && !guestId) return redirect('/')

  const companies: Company[] = await Promise.all(
    STUDIOS.map(async id => {
      const company = await getCompanyDetails(Number(id.id))
      return company as Company
    }),
  )

  return {
    companies,
  }
}

export default function StudiosPage() {
  const { companies } = useLoaderData<typeof loader>()
  return (
    <div className='mx-auto min-h-screen max-w-[1200px] text-white'>
      <h1 className='mb-6 text-3xl font-bold'>🎬 Studios </h1>
      <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
        {companies.map(company => (
          <CompanyRow key={company.id} company={company} />
        ))}
      </div>
    </div>
  )
}
