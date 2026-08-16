/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fondos
        'bg-primary': '#FAFAFA',
        'bg-secondary': '#F4F4F5',
        'bg-card': '#FFFFFF',
        'border-default': '#E4E4E7',

        // Texto
        'text-primary': '#18181B',
        'text-secondary': '#71717A',
        'text-tertiary': '#A1A1AA',

        // Acentos
        'accent-green': '#16A34A',
        'accent-purple': '#7C3AED',
        'accent-orange': '#EA580C',
        'accent-red': '#DC2626',
        'accent-blue': '#2563EB',

        // Niveles
        'level-1': '#7C3AED',
        'level-2': '#16A34A',
        'level-3': '#EA580C',
        'level-4': '#DC2626',

        // Terminal
        'terminal-bg': '#1E1E2E',
        'terminal-text': '#A6E3A1',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
}
