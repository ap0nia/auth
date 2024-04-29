import { eventToRequest } from '@aponia.js/sveltekit'
import { error } from '@sveltejs/kit'

import { providers } from '$server/services/auth'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
  const providerId = event.params.provider as keyof typeof providers

  const provider = providers[providerId]

  if (provider == null) {
    return error(500, `Unknown provider ID: ${providerId}`)
  }

  const authRequest = eventToRequest(event)

  const authResponse = await provider.callback(authRequest)

  console.log('res: ', authResponse)
  console.log('state: ', event.url.searchParams.get('state'))
  return new Response('OK')
}
