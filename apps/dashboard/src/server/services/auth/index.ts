/**
 * TODO: add credentials provider for username/password login.
 * TODO: add passwordless email provider.
 */

import { AdapterPlugin } from '@aponia.js/core/adapter'
import { Auth as AponiaAuth } from '@aponia.js/core/auth'
import { Context } from 'effect'

import { PUBLIC_AUTH_PROXY } from '$env/static/public'

import { adapter as rawAdapter } from './adapter'
import { providers } from './providers'
import { jwt } from './session'

/**
 * After logging in with a provider, e.g. GitHub, Google, Credentials,
 * handles the logic for account, user, and session entities in the database.
 */
const adapter = new AdapterPlugin(rawAdapter)

export const auth = new AponiaAuth({
  origin: PUBLIC_AUTH_PROXY,
  plugins: [...Object.values(providers), adapter, jwt],
})

/**
 * Auth dependency for effects.
 */
export class Auth extends Context.Tag('Auth')<Auth, typeof auth>() {}
