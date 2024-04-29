/**
 * TODO: add credentials provider for username/password login.
 * TODO: add passwordless email provider.
 */

import { OIDCProvider } from '@aponia.js/auth.js/providers/oidc'
import { AdapterPlugin } from '@aponia.js/core/adapter'
import { Auth } from '@aponia.js/core/auth'
import { JwtSessionPlugin } from '@aponia.js/core/plugins/session/jwt'
import Google, { type GoogleProfile as _GoogleProfile } from '@auth/core/providers/google'

import { GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'

import { adapter as rawAdapter } from './adapter'

export const google = new OIDCProvider(
  Google({
    clientId: GOOGLE_ID,
    clientSecret: GOOGLE_SECRET,
  }),
)

/**
 * After logging in with a provider, e.g. GitHub, Google, Credentials,
 * handles the logic for account, user, and session entities in the database.
 */
const adapter = new AdapterPlugin(rawAdapter)

/**
 * encodes/decodes cookies whenever session is set or read.
 */
export const jwt = new JwtSessionPlugin()

export const auth = new Auth({
  /**
   * Handle callback routes manually to enable dynamic redirections.
   */
  // exclude: ['/auth/callback/.*'],
  plugins: [google, adapter, jwt],
})

export const providers = {
  google,
}
