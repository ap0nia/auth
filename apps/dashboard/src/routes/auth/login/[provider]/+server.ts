import { eventToRequest } from '@aponia.js/sveltekit'
import { error } from '@sveltejs/kit'

import { auth } from '$server/services/auth'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
  const authRequest = eventToRequest(event)
  const authResponse = await auth.handle(authRequest)

  if (authResponse?.redirect == null) {
    return error(500, `Failed to generate redirect URL for: ${event.params.provider}`)
  }

  /**
   * Create custom state variable, which is a key to database for storing redirect.
   */
  const state = 'HI'

  // Update the original OAuth redirect URL to include the state variable.
  const redirectUrl = new URL(authResponse.redirect)

  redirectUrl.searchParams.set('state', state)

  // Update the original auth response.
  authResponse.redirect = redirectUrl.toString()

  const authResponseWithState = auth.toResponse(authResponse)

  if (authResponseWithState == null) {
    return error(500, `Failed to create auth response for: ${event.params.provider}`)
  }

  return authResponseWithState
}
