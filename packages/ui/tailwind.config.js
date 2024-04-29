// @ts-check

import typography from '@tailwindcss/typography'

import daisyui from 'daisyui'
import themes from 'daisyui/src/theming/themes'

const defaultThemes = /** @type {import('daisyui').Theme[]} */ (Object.keys(themes))

/**
 * @type {import('tailwindcss').Config}
 */
const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [daisyui, typography],
  daisyui: {
    themes: [
      ...defaultThemes,
      {
        light: themes.corporate,
        dark: themes.dracula,
      },
    ],
  },
  theme: {
    extend: {
      animation: {
        'meteor-effect': 'meteor 5s linear infinite',
      },
      keyframes: {
        meteor: {
          '0%': {
            transform: 'rotate(215deg) translateX(0)',
            opacity: '1',
          },
          '70%': {
            opacity: '1',
          },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: '0',
          },
        },
      },
    },
  },
}

export default config
