import { OIDCProvider } from '@aponia.js/auth.js/providers/oidc'
import Google, { type GoogleProfile as _GoogleProfile } from '@auth/core/providers/google'

import { env } from '$env/dynamic/private'

export const google = new OIDCProvider(
  Google({
    clientId: env.GOOGLE_ID,
    clientSecret: env.GOOGLE_SECRET,
    checks: ['pkce', 'state'],
  }),
)

export const providers = { google }
