import { eventToRequest } from '@aponia.js/sveltekit'
import { error, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { Effect } from 'effect'

import { notNullable } from '$lib/effects/null'
import { DbSelectError } from '$lib/errors/db'
import { encodeSearchParams, forwardSearchParams } from '$lib/utils/search-params'
import { state } from '$server/db'
import { auth } from '$server/services/auth'
import { db } from '$server/services/db'

import type { RequestEvent, RequestHandler } from './$types'

const handleRegularCallback = (event: RequestEvent) => {
  return Effect.gen(function* (_) {
    const authRequest = eventToRequest(event)
    const authResponse = yield* _(Effect.promise(() => auth.handle(authRequest)))
    const response = yield* _(notNullable(auth.toResponse(authResponse)))
    return response
  })
}

const handleCallback = (event: RequestEvent) => {
  const id = event.url.searchParams.get('state')
  const provider = event.params.provider

  const effect = Effect.gen(function* (_) {
    if (id == null) {
      const response = yield* _(handleRegularCallback(event))
      return response
    }

    const state = yield* _(findState(id))

    if (state == null) {
      const response = yield* _(handleRegularCallback(event))
      return response
    }

    const params = new URLSearchParams(state.params)

    const originalRedirect = params.get('redirect_uri') ?? event.url.origin

    if (originalRedirect.startsWith(event.url.origin)) {
      const response = yield* _(handleRegularCallback(event))
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

function findState(id: string) {
  const effect = Effect.gen(function* (_) {
    const result = yield* _(
      Effect.tryPromise({
        try: async () => {
          return await db.query.state.findFirst({
            where: eq(state.id, id),
          })
        },
        catch: (error) => {
          console.error(`Error while searching for state with id ${id}`, error)
          return new DbSelectError()
        },
      }),
    )
    return result
  })
  return effect
}

export const GET: RequestHandler = async (event) => {
  return await Effect.runPromise(handleCallback(event))
}
