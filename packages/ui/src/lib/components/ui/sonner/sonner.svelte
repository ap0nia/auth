<script lang="ts">
  import { mode } from 'mode-watcher'
  import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner'

  type $$Props = SonnerProps
</script>

<Sonner
  theme={$mode}
  class="toaster group"
  toastOptions={{
    classes: {
      toast:
        'group group-[.toaster]:bg-base-100 group-[.toaster]:text-base-content group-[.toaster]:border-base-content group-[.toaster]:shadow-lg',
      description: 'group-[.toast]:text-base-content',
      actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
      cancelButton: 'group-[.toast]:bg-ghost',
    },
  }}
  {...$$restProps}
/>
