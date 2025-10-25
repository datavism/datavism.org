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
          50: '#f0fff4',
          100: '#c6f6d5',
          200: '#9ae6b4',
          300: '#68d391',
          400: '#48bb78',
          500: '#38a169',
          600: '#2f855a',
          700: '#276749',
          800: '#22543d',
          900: '#1c4532',
          950: '#0a2817',
        },
        yellow: {
          50: '#fffef0',
          100: '#fefcbf',
          200: '#faf089',
          300: '#f6e05e',
          400: '#ecc94b',
          500: '#d69e2e',
          600: '#b7791f',
          700: '#975a16',
          800: '#744210',
          900: '#5f370e',
        },
        red: {
          50: '#fff5f5',
          100: '#fed7d7',
          200: '#feb2b2',
          300: '#fc8181',
          400: '#f56565',
          500: '#e53e3e',
          600: '#c53030',
          700: '#9b2c2c',
          800: '#822727',
          900: '#63171b',
        },
        cyan: {
          50: '#edfdfd',
          100: '#c4f1f9',
          200: '#9decf9',
          300: '#76e4f7',
          400: '#0bc5ea',
          500: '#00b5d8',
          600: '#00a3c4',
          700: '#0987a0',
          800: '#086f83',
          900: '#065666',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.95rem', { lineHeight: '1.6' }],
        'sm': ['1.1rem', { lineHeight: '1.7' }],
        'base': ['1.25rem', { lineHeight: '1.75' }],
        'lg': ['1.4rem', { lineHeight: '1.7' }],
        'xl': ['1.65rem', { lineHeight: '1.65' }],
        '2xl': ['2rem', { lineHeight: '1.5' }],
        '3xl': ['2.5rem', { lineHeight: '1.4' }],
        '4xl': ['3rem', { lineHeight: '1.3' }],
        '5xl': ['3.75rem', { lineHeight: '1.2' }],
        '6xl': ['4.5rem', { lineHeight: '1.1' }],
        '7xl': ['5rem', { lineHeight: '1.1' }],
        '8xl': ['6.5rem', { lineHeight: '1' }],
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