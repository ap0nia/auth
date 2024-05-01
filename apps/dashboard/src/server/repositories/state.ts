import { eq } from 'drizzle-orm'
import { Effect } from 'effect'

import { DbSelectError } from '$lib/errors/db'
import { state } from '$server/db/state'
import { Db } from '$server/services/db'

export function findById(id: string) {
  const effect = Effect.gen(function* (_) {
    const db = yield* _(Db)
    const result = yield* _(
      Effect.tryPromise({
        try: async () => {
          return await db.query.state.findFirst({
            where: eq(state.id, id),
          })
        },
        catch: (error) => {
          console.error(`Error while searching for state with id ${id}`, error)
          return new DbSelectError()
        },
      }),
    )
    return result
  })
  return effect
}

export function insert(value: typeof state.$inferInsert) {
  const effect = Effect.gen(function* (_) {
    const db = yield* _(Db)
    const result = yield* _(
      Effect.tryPromise({
        try: async () => {
          return await db.insert(state).values(value).returning()
        },
        catch: (error) => {
          console.error(`Error inserting new state value: `, error)
          return new DbSelectError()
        },
      }),
    )
    return result
  })
  return effect
}
