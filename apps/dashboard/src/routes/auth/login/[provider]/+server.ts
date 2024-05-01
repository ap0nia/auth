import { eventToRequest } from '@aponia.js/sveltekit'
import { createId } from '@paralleldrive/cuid2'
import { error } from '@sveltejs/kit'

import { state } from '$server/db/state'
import { auth } from '$server/services/auth'
import { db } from '$server/services/db'

import type { RequestHandler } from './$types'

const AUTH_PROXY_ORIGIN = 'https://d16zahr97f1m40.cloudfront.net'

export const GET: RequestHandler = async (event) => {
  const authRequest = eventToRequest(event)
  const authResponse = await auth.handle(authRequest)

  if (authResponse?.redirect == null) {
    return error(500, `Failed to generate redirect URL for: ${event.params.provider}`)
  }

  const oauthRedirect = new URL(authResponse.redirect)

  const originalRedirectUrl = oauthRedirect.searchParams.get('redirect_uri') ?? event.url.origin

  if (originalRedirectUrl.startsWith(AUTH_PROXY_ORIGIN)) {
    if (event.url.searchParams.size > 0) {
      const forwardedUrl = new URL(authResponse.redirect)

      Array.from(forwardedUrl.searchParams.keys()).forEach((key) => {
        if (key !== 'redirect_uri') {
          forwardedUrl.searchParams.delete(key)
        }
      })

      event.url.searchParams.forEach((value, key) => {
        if (key !== 'redirect_uri') {
          forwardedUrl.searchParams.set(key, value)
        }
      })

      authResponse.redirect = forwardedUrl.toString()
    }

    const response = auth.toResponse(authResponse)

    if (response == null) {
      return error(500, `Failed to create auth response for: ${event.params.provider}`)
    }

    return response
  }

  const stateId = oauthRedirect.searchParams.get('state')

  const id = stateId ?? event.url.searchParams.get('state') ?? createId()

  if (stateId == null) {
    oauthRedirect.searchParams.set('state', id)
  }

  const [newState] = await db
    .insert(state)
    .values({
      id,
      params: oauthRedirect.searchParams.toString(),
    })
    .returning()

  if (newState == null) {
    return error(500, `Failed to save state: ${event.params.provider}`)
  }

  authResponse.redirect = `${AUTH_PROXY_ORIGIN}/auth/login/${event.params.provider}?${oauthRedirect.searchParams}`

  const response = auth.toResponse(authResponse)

  if (response == null) {
    return error(500, `Failed to create auth response for: ${event.params.provider}`)
  }

  return response
}
