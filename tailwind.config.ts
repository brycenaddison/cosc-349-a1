import plugin from 'tailwindcss/plugin';
import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    textShadow: {
      sm: '0 0 2px var(--tw-shadow-color)',
      DEFAULT: '0 0 4px var(--tw-shadow-color)',
      lg: '0 0 16px var(--tw-shadow-color)',
    },
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        tile: '0 3px 10px rgb(0 0 0 / 0.5)',
      },
    },
  },
  plugins: [
    require('daisyui'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'text-glow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      );
    }),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.scrollbar-hidden': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    }),
  ],
} satisfies Config;
