import { createId } from '@paralleldrive/cuid2'
import { error } from '@sveltejs/kit'
import { Effect } from 'effect'

import { PUBLIC_AUTH_PROXY } from '$env/static/public'
import { notNullable } from '$lib/effects/null'
import { handleAuthRequest } from '$lib/effects/sveltekit'
import { HandleError, RedirectError, SecurityError } from '$lib/errors/oauth'
import { encodeSearchParams, overrideSearchParams } from '$lib/utils/search-params'
import { insert } from '$server/repositories/state'
import { layer } from '$server/services'
import { Auth } from '$server/services/auth'

import type { RequestEvent, RequestHandler } from './$types'

function handleLogin(event: RequestEvent) {
  const effect = Effect.gen(function* (_) {
    const auth = yield* _(Auth)

    const maybeAuthResponse = yield* _(handleAuthRequest(event))

    const authResponse = yield* _(
      Effect.mapError(notNullable(maybeAuthResponse), () => new HandleError()),
    )

    const authResponseRedirect = yield* _(
      Effect.mapError(notNullable(authResponse?.redirect), () => new RedirectError()),
    )

    const oauthRedirect = new URL(authResponseRedirect)

    const originalRedirectUrl = oauthRedirect.searchParams.get('redirect_uri') ?? event.url.origin

    if (originalRedirectUrl.startsWith(PUBLIC_AUTH_PROXY)) {
      const forwardedUrl = new URL(authResponseRedirect)

      overrideSearchParams(event.url.searchParams, forwardedUrl.searchParams, 'redirect_uri')

      authResponse.redirect = forwardedUrl.toString()

      const maybeResponse = auth.toResponse(authResponse)

      const response = yield* _(
        Effect.mapError(notNullable(maybeResponse), () => new HandleError()),
      )

      return response
    }

    const stateId = oauthRedirect.searchParams.get('state')

    const id = stateId ?? event.url.searchParams.get('state') ?? createId()

    if (stateId == null) {
      oauthRedirect.searchParams.set('state', id)
    }

    const [maybeNewState] = yield* _(
      insert({
        id,
        params: oauthRedirect.searchParams.toString(),
      }),
    )

    yield* _(Effect.mapError(notNullable(maybeNewState), () => new SecurityError()))

    const queryString = encodeSearchParams(oauthRedirect.searchParams)

    authResponse.redirect = `${PUBLIC_AUTH_PROXY}${event.url.pathname}${queryString}`

    const maybeResponse = auth.toResponse(authResponse)

    const response = yield* _(Effect.mapError(notNullable(maybeResponse), () => new HandleError()))

    return response
  })

  const mappedEffect = Effect.mapError(effect, (err) => {
    switch (err._tag) {
      case 'SecurityError':
      case 'DbSelectError': {
        return error(500, `Failed to generate and save state for: ${event.params.provider}`)
      }

      case 'HandleError': {
        return error(500, `Failed to handle auth request for: ${event.params.provider}`)
      }

      case 'RedirectError': {
        return error(500, `Failed to generate redirect URL for: ${event.params.provider}`)
      }
    }
  })

  return mappedEffect
}

export const GET: RequestHandler = async (event) => {
  return await Effect.runPromise(Effect.provide(handleLogin(event), layer))
}
