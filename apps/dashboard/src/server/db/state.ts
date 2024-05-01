import { createId } from '@paralleldrive/cuid2'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * State variables generated for OAuth.
 */
export const state = sqliteTable('state', {
  id: text('id').primaryKey().$defaultFn(createId),

  /**
   * The original search params sent with the OAuth request.
   */
  params: text('params').default('').notNull(),
})

export type State = typeof state.$inferSelect
