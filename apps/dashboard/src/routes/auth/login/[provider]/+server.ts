import { eventToRequest } from '@aponia.js/sveltekit'
import { error } from '@sveltejs/kit'

import { state } from '$server/db/state'
import { auth } from '$server/services/auth'
import { db } from '$server/services/db'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
  const authRequest = eventToRequest(event)
  const authResponse = await auth.handle(authRequest)

  if (authResponse?.redirect == null) {
    return error(500, `Failed to generate redirect URL for: ${event.params.provider}`)
  }

  /**
   * Origin of the authentication request.
   */
  const redirectUrl = event.url.searchParams.get('redirect_url')

  // If the authentication request originated from a different domain, create a database entry.
  if (redirectUrl != null) {
    const [newState] = await db.insert(state).values({ redirectUrl }).returning()

    if (newState == null) {
      return error(500, `Failed to create auth response for: ${event.params.provider}`)
    }

    // Update the original OAuth redirect URL to include the state variable.
    const oauthRedirectUrl = new URL(authResponse.redirect)

    oauthRedirectUrl.searchParams.set('state', newState.id)

    // Update the original auth response.
    authResponse.redirect = oauthRedirectUrl.toString()
  }

  const response = auth.toResponse(authResponse)

  if (response == null) {
    return error(500, `Failed to create auth response for: ${event.params.provider}`)
  }

  return response
}
