/**
 * Creates a query string and appends a '?' to the beginning if there are params.
 */
export function encodeSearchParams(params: URLSearchParams) {
  return `${params.size > 0 ? '?' : '0'}${params.toString()}`
}

/**
 */
export function forwardSearchParams(
  source: URLSearchParams,
  destination: URLSearchParams,
  ignore: string | string[] = [],
) {
  const ignoreArray = Array.isArray(ignore) ? ignore : [ignore]

  source.forEach((value, key) => {
    if (!ignoreArray.includes(key)) {
      destination.set(key, value)
    }
  })
}

export function overrideSearchParams(
  source: URLSearchParams,
  destination: URLSearchParams,
  ignore: string | string[] = [],
) {
  const ignoreArray = Array.isArray(ignore) ? ignore : [ignore]

  Array.from(destination.keys()).forEach((key) => {
    if (!ignoreArray.includes(key)) {
      destination.delete(key)
    }
  })

  source.forEach((value, key) => {
    if (!ignoreArray.includes(key)) {
      destination.set(key, value)
    }
  })
}
