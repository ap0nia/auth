<script lang="ts">
  import * as Sheet from '@icssc/ui/sheet/index.js'

  import MenuRoundedIcon from '~icons/material-symbols/menu-rounded'

  import { afterNavigate } from '$app/navigation'
  import LanguageSelect from '$lib/components/language-select.svelte'
  import Logo from '$lib/components/icons/logo.svelte'
  import ThemeToggle from '$lib/components/theme/toggle.svelte'

  let open = false

  function closeDrawer() {
    open = false
  }

  afterNavigate(() => {
    closeDrawer()
  })
</script>

<!--
  The sheet root wraps the entire header so the trigger can be part of the nav,
  but the content is outside.

  This prevents layout shifts when the sheet content is part of the header.
-->
<Sheet.Root bind:open>
  <header class="sticky top-0 z-30 flex justify-center border-b bg-base-100 bg-opacity-90 backdrop-blur">
    <div class="navbar max-w-7xl justify-between gap-4">
      <div class="navbar-start gap-2">
        <Sheet.Trigger class="block lg:hidden btn btn-sm btn-ghost">
          <MenuRoundedIcon class="h-6 w-6 text-primary" />
        </Sheet.Trigger>

        <a href="/">
          <Logo class="w-12 h-12 rounded-full" />
        </a>
      </div>

      <div class="navbar-center grow flex justify-end hidden lg:flex px-1">
        <ul class="menu menu-horizontal">
          <li>
            <a href="/projects">ICS Week</a>
          </li>
          <li>
            <a href="/sponsors">Election</a>
          </li>
        </ul>

        <div class="divider divider-horizontal w-0 mx-0"></div>

        <ul class="menu menu-horizontal">
          <li>
            <details>
              <summary>About</summary>
              <ul class="py-2 border bg-base-200 rounded-t-none">
                <li>
                  <a href="/about" class="truncate">About Us</a>
                </li>
                <li>
                  <a href="/committees" class="truncate">Committees</a>
                </li>
                <li>
                  <a href="/board" class="truncate">Board</a>
                </li>
                <li class="border h-0"></li>
                <li>
                  <a href="/join" class="truncate">Join Us</a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details>
              <summary>Events</summary>
              <ul class="p-2 border bg-base-200 rounded-t-none">
                <li>
                  <a href="/events" class="truncate">Our Events</a>
                </li>
                <li>
                  <a href="/ics-week" class="truncate">ICSSC Week</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a href="/projects">Projects</a>
          </li>
          <li>
            <a href="/sponsors">Sponsors</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>

      <div class="navbar-end flex shrink-0 items-center gap-2 w-auto">
        <div class="hidden sm:flex gap-2">
          <ThemeToggle class="h-8 ring-1 ring-base-content" />
          <LanguageSelect />
        </div>

        <a href="/auth/login" class="btn btn-primary btn-sm">Login</a>
      </div>
    </div>
  </header>

  <Sheet.Content
    side="left"
    class="fixed z-50 gap-4 bg-base-100 p-6 shadow-lg inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm"
  >
    <div>
      <a href="/">
        <Logo class="w-12 h-12 rounded-full" />
      </a>
    </div>

    <div class="divider"></div>

    <ul class="menu">
      <li>
        <details>
          <summary>About</summary>
          <ul class="py-2 border bg-base-200 rounded-t-none">
            <li>
              <a href="/about" class="truncate">About Us</a>
            </li>
            <li>
              <a href="/committees" class="truncate">Committees</a>
            </li>
            <li>
              <a href="/board" class="truncate">Board</a>
            </li>
            <li class="border h-0"></li>
            <li>
              <a href="/join" class="truncate">Join Us</a>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary>Events</summary>
          <ul class="p-2 border bg-base-200 rounded-t-none">
            <li>
              <a href="/events" class="truncate">Our Events</a>
            </li>
            <li>
              <a href="/ics-week" class="truncate">ICSSC Week</a>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <a href="/projects">Projects</a>
      </li>
      <li>
        <a href="/sponsors">Sponsors</a>
      </li>
      <li>
        <a href="/contact">Contact</a>
      </li>
    </ul>
  </Sheet.Content>
</Sheet.Root>
