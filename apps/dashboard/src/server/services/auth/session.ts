import { JwtSessionPlugin } from '@aponia.js/core/plugins/session/jwt'

/**
 * encodes/decodes cookies whenever session is set or read.
 */
export const jwt = new JwtSessionPlugin()
