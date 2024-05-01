import { eventToRequest } from '@aponia.js/sveltekit'
import { error, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

import { state } from '$server/db'
import { auth, providers } from '$server/services/auth'
import { db } from '$server/services/db'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
  const providerId = event.params.provider as keyof typeof providers

  const stateId = event.url.searchParams.get('state')

  if (stateId == null) {
    const authRequest = eventToRequest(event)
    const authResponse = await auth.handle(authRequest)
    const response = auth.toResponse(authResponse)

    if (response == null) {
      return error(500, `Failed to respond for: ${providerId}`)
    }

    return response
  }

  const stateEntry = await db.query.state.findFirst({
    where: eq(state.id, stateId),
  })

  if (stateEntry == null) {
    const authRequest = eventToRequest(event)
    const authResponse = await auth.handle(authRequest)
    const response = auth.toResponse(authResponse)

    if (response == null) {
      return error(500, `Failed to respond for: ${providerId}`)
    }

    return response
  }

  const params = new URLSearchParams(stateEntry.params)

  const originalRedirect = params.get('redirect_uri') ?? event.url.origin

  if (originalRedirect.startsWith(event.url.origin)) {
    const authRequest = eventToRequest(event)
    const authResponse = await auth.handle(authRequest)
    const response = auth.toResponse(authResponse)

    if (response == null) {
      return error(500, `Failed to respond for: ${providerId}`)
    }

    return response
  }

  event.url.searchParams.forEach((value, key) => {
    params.set(key, value)
  })

  return redirect(
    307,
    `${originalRedirect}${event.url.searchParams.size > 0 ? '?' : ''}${event.url.searchParams}`,
  )
}
