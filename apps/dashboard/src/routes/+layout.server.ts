import { THEME_KEY } from '$lib/config/theme'

import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
  const theme = event.cookies.get(THEME_KEY)

  return {
    theme,
  }
}
