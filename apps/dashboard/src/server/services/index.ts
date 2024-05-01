import { Layer } from 'effect'

import { Auth, auth } from './auth'
import { Db, db } from './db'

export const dbLive = Layer.succeed(Db, db)

export const authLive = Layer.succeed(Auth, auth)

/**
 * Default live dependencies in a layer.
 */
export const layer = Layer.merge(dbLive, authLive)
