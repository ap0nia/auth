import { Effect } from 'effect'

class NullError {
  readonly _tag = 'Null'
}

class NotNullError {
  readonly _tag = 'NotNull'
}

class FalseError {
  readonly _tag = 'False'
}

/**
 * Succeeds if error is non-nullable.
 */
export const notNullable = <T>(value: T) => {
  return value == null ? Effect.fail(new NotNullError()) : Effect.succeed(value)
}

/**
 * Succeeds if error is nullable.
 */
export const isNullable = <T>(value: T) => {
  return value == null ? Effect.succeed(undefined) : Effect.fail(new NullError())
}

/**
 * Succeeds if error is not explicitly false.
 */
export const notFalse = <T>(value: T): Effect.Effect<Exclude<T, false>, FalseError> => {
  return value === false ? Effect.fail(new FalseError()) : Effect.succeed(value as any)
}
