/**
 * Creates a query string and appends a '?' to the beginning if there are params.
 */
export function encodeSearchParams(params: URLSearchParams) {
  return `${params.size > 0 ? '?' : '0'}${params.toString()}`
}

/**
 */
export function forwardSearchParams(source: URLSearchParams, destination: URLSearchParams) {
  source.forEach((value, key) => {
    destination.set(key, value)
  })
}
