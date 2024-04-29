import { createId } from '@paralleldrive/cuid2'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * State variables generated for OAuth.
 */
export const state = sqliteTable('state', {
  id: text('id').primaryKey().$defaultFn(createId),

  /**
   * The origin of the request.
   */
  redirectUrl: text('redirect_url').notNull(),
})

export type State = typeof state.$inferSelect
