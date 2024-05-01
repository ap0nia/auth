import { eventToRequest } from '@aponia.js/sveltekit'
import type { RequestEvent } from '@sveltejs/kit'
import { redirect as sveltekitRedirect } from '@sveltejs/kit'
import { Effect } from 'effect'

import { HandleError } from '$lib/errors/oauth'
import { Auth } from '$server/services/auth'

export function handleAuthRequest(event: RequestEvent) {
  return Effect.gen(function* (_) {
    const auth = yield* _(Auth)
    const authRequest = eventToRequest(event)
    const authResponse = yield* _(
      Effect.tryPromise({
        try: async () => {
          return auth.handle(authRequest)
        },
        catch: (error) => {
          console.error('Error ocurred while handling auth request: ', error)
          return new HandleError()
        },
      }),
    )
    return authResponse
  })
}

export function redirect(...args: Parameters<typeof sveltekitRedirect>) {
  try {
    return Effect.fail(sveltekitRedirect(...args))
  } catch (e) {
    return Effect.fail(e)
  }
}

/**
 * Runs a handler effect and propagates SvelteKit errors properly.
 */
export async function runHandleEffect<T>(effect: Effect.Effect<T>) {
  const caughtDefects = Effect.catchAllDefect(effect, Effect.succeed)

  const result = await Effect.runPromise(caughtDefects)

  if (result instanceof Response) {
    return result
  }

  throw result
}
