<script lang="ts">
  import Header from '$lib/components/layout/header.svelte'
</script>

<div class="flex flex-col min-h-screen">
  <Header />

  <slot />

  <div>Footer</div>
</div>
