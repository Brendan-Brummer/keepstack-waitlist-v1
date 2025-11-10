import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#08080a',
        'keepstack-blue': '#0201d7',
        charcoal: '#1e1e26',
        indigo: '#6c6e80',
        volt: {
          blue: '#0201d7',
          cyan: '#12e6ff',
        },
      },
      fontFamily: {
        aeonik: ['Aeonik', 'sans-serif'],
        suisse: ['Suisse Intl', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-bounce': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'fade-in': 'fade-in 300ms ease-out',
        'slide-up': 'slide-up 400ms ease-out',
        'scale-bounce': 'scale-bounce 500ms ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
