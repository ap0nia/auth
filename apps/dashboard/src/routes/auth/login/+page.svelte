<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<main>
  <h1>
    Hello, log in here
  </h1>

  <div>
    You're logging in to the origin: {data.origin}
  </div>
</main>
