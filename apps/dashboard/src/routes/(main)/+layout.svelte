<script lang="ts">
  import Header from '$lib/components/layout/header.svelte'
  import DiscordIcon from '~icons/ic/outline-discord'
  import FacebookIcon from '~icons/mdi/facebook'
  import InstagramIcon from '~icons/mdi/instagram'
</script>

<div class="flex flex-col min-h-screen">
  <Header />

  <slot />

  <div class="px-16 py-8 border-t bg-base-200 text-base-content border-base-300">
    <footer class="footer max-w-7xl mx-auto items-center">
      <aside>
        <p>© 2024 ICSSC. All rights reserved</p>
      </aside>

      <nav class="w-full flex justify-end gap-4">
        <a
          data-tip="Follow on Facebook"
          href="https://www.facebook.com/ICSStudentCouncil/"
          target="_blank"
          class="tooltip"
        >
          <FacebookIcon class="w-6 h-6" />
        </a>
        <a
          data-tip="Follow on Instagram"
          href="https://www.instagram.com/icssc.uci/"
          target="_blank"
          class="tooltip"
        >
          <InstagramIcon class="w-6 h-6" />
        </a>

        <a
          data-tip="Follow on Discord"
          href="https://discord.gg/c4t5dGcM9S"
          target="_blank"
          class="tooltip"
        >
          <DiscordIcon class="w-6 h-6" />
        </a>
      </nav>
    </footer>
  </div>
</div>
