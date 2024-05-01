<script lang="ts">
  import '../app.css'

  import { Toaster } from '@icssc/ui/sonner/index.js'
  import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit'

  import ThemeWatcher from '$lib/components/theme/watcher.svelte'
  import { theme } from '$lib/config/theme'
  import { i18n } from '$lib/i18n'

  import type { LayoutData } from './$types'

  export let data: LayoutData

  /**
   * Set the global theme based on the saved cookie value when the page is rendered for the first time.
   */
  theme.set({ value: data.theme ?? '', label: data.theme ?? '' })
</script>

<Toaster />
<ThemeWatcher />

<ParaglideJS {i18n}>
  <slot />
</ParaglideJS>
