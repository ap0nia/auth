/**
 * Creates a query string and appends a '?' to the beginning if there are params.
 */
export function encodeQueryString(params: URLSearchParams) {
  return `${params.size > 0 ? '?' : '0'}${params.toString()}`
}
