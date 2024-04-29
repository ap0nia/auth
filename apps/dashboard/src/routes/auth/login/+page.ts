import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  const error = event.url.searchParams.get('error')
  const origin = event.url.searchParams.get('origin')

  return {
    error,
    origin,
  }
}
