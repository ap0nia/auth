import { OIDCProvider } from '@aponia.js/auth.js/providers/oidc'
import Google, { type GoogleProfile as _GoogleProfile } from '@auth/core/providers/google'

import { GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'

export const google = new OIDCProvider(
  Google({
    clientId: GOOGLE_ID,
    clientSecret: GOOGLE_SECRET,
    checks: ['pkce', 'state'],
  }),
)

export const providers = { google }
