import { error, redirect } from '@sveltejs/kit'
import { Effect } from 'effect'

import { notNullable } from '$lib/effects/null'
import { handleAuthRequest } from '$lib/effects/sveltekit'
import { encodeSearchParams, forwardSearchParams } from '$lib/utils/search-params'
import { findById } from '$server/repositories/state'
import { layer } from '$server/services'
import { Auth } from '$server/services/auth'

import type { RequestEvent, RequestHandler } from './$types'

/**
 * Creates {@link Aponia.Response} and converts it to {@link Response} for SvelteKit.
 */
function handleAuthCallback(event: RequestEvent) {
  const effect = Effect.gen(function* (_) {
    const auth = yield* _(Auth)
    const authResponse = yield* _(handleAuthRequest(event))
    const response = yield* _(notNullable(auth.toResponse(authResponse)))
    return response
  })
  return effect
}

function handleCallback(event: RequestEvent) {
  const id = event.url.searchParams.get('state')
  const provider = event.params.provider

  const effect = Effect.gen(function* (_) {
    if (id == null) {
      const response = yield* _(handleAuthCallback(event))
      return response
    }

    const state = yield* _(findById(id))

    if (state == null) {
      const response = yield* _(handleAuthCallback(event))
      return response
    }

    const params = new URLSearchParams(state.params)

    const originalRedirect = params.get('redirect_uri') ?? event.url.origin

    if (originalRedirect.startsWith(event.url.origin)) {
      const response = yield* _(handleAuthCallback(event))
      return response
    }

    forwardSearchParams(event.url.searchParams, params)

    return redirect(307, `${originalRedirect}${encodeSearchParams(event.url.searchParams)}`)
  })

  const mappedEffect = Effect.mapError(effect, (_err) => {
    return error(500, `Failed to handle callback for provider: ${provider}.`)
  })

  return mappedEffect
}

export const GET: RequestHandler = async (event) => {
  return await Effect.runPromise(Effect.provide(handleCallback(event), layer))
}
