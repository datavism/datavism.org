import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          400: '#00ff41',
          300: '#33ff66',
          500: '#00cc33',
        },
        yellow: {
          400: '#ffff00',
        },
        red: {
          400: '#ff0040',
          500: '#cc0033',
        },
        cyan: {
          400: '#00ffff',
        },
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        blink: 'blink 1s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config