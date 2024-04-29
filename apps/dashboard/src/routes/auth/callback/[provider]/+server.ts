import { eventToRequest } from '@aponia.js/sveltekit'
import { error, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

import { state } from '$server/db'
import { auth, providers } from '$server/services/auth'
import { db } from '$server/services/db'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
  const providerId = event.params.provider as keyof typeof providers

  const provider = providers[providerId]

  if (provider == null) {
    return error(500, `Unknown provider ID: ${providerId}`)
  }

  const stateId = event.url.searchParams.get('state')

  if (stateId == null) {
    const authRequest = eventToRequest(event)
    const authResponse = await auth.handle(authRequest)
    const response = auth.toResponse(authResponse)

    if (response == null) {
      return error(500, `Failed to respond for: ${providerId}`)
    }

    console.log('res: ', response)

    return response
  }

  const stateEntry = await db.query.state.findFirst({
    where: eq(state.id, stateId),
  })

  if (stateEntry == null) {
    return error(500, `State ID not found.`)
  }

  // Remove state search param since only this proxy needs it.

  event.url.searchParams.delete('state')

  const searchParams = event.url.searchParams.size > 0 ? `?${event.url.searchParams}` : ''

  return redirect(302, `${stateEntry.redirectUrl}${searchParams}`)
}
