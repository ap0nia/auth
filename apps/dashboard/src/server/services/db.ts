import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql'
import { Context } from 'effect'

import { TURSO_AUTH_TOKEN, TURSO_CONNECTION_URL } from '$env/static/private'
import * as schema from '$server/db'

export const client = createClient({
  url: TURSO_CONNECTION_URL,
  authToken: TURSO_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })

/**
 * Db dependency for effects.
 */
export class Db extends Context.Tag('Db')<Db, typeof db>() {}

export type DbService = typeof db
