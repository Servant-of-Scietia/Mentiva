import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        'mentiva-dark': '#1a1a1a',
        'mentiva-bg': '#f5f3f0',
        'mentiva-card': '#ffffff',
        'mentiva-accent': '#f59e0b',
        'mentiva-accent-dark': '#d97706',
        'mentiva-text-primary': '#1f2937',
        'mentiva-text-secondary': '#6b7280',
        'mentiva-text-muted': '#9ca3af'
      },
      spacing: {
        'spacing-xs': '0.25rem',
        'spacing-sm': '0.5rem',
        'spacing-md': '1rem',
        'spacing-lg': '1.5rem',
        'spacing-xl': '2rem',
        'spacing-2xl': '3rem'
      }
    }
  },
  plugins: []
} as Config
