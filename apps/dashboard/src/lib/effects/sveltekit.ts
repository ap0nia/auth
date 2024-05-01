import { eventToRequest } from '@aponia.js/sveltekit'
import type { RequestEvent } from '@sveltejs/kit'
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
