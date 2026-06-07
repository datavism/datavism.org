import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Safelist für dynamisch generierte Klassen (Rollen-Farben)
  safelist: [
    // Cyan (Data Warrior)
    'text-cyan-400', 'text-cyan-300', 'text-cyan-500',
    'bg-cyan-400', 'bg-cyan-500', 'bg-cyan-500/20', 'bg-cyan-900/30',
    'border-cyan-400', 'border-cyan-500',
    'from-cyan-500', 'to-cyan-600',
    // Yellow (Code Rebel)
    'text-yellow-400', 'text-yellow-300', 'text-yellow-500',
    'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-500/20', 'bg-yellow-900/30',
    'border-yellow-400', 'border-yellow-500',
    'from-yellow-500', 'to-yellow-600',
    // Green (Viz Artist)
    'text-green-400', 'text-green-300', 'text-green-500',
    'bg-green-400', 'bg-green-500', 'bg-green-500/20', 'bg-green-900/30',
    'border-green-400', 'border-green-500',
    'from-green-500', 'to-green-600',
    // Purple (Truth Explorer)
    'text-purple-400', 'text-purple-300', 'text-purple-500',
    'bg-purple-400', 'bg-purple-500', 'bg-purple-500/20', 'bg-purple-900/30',
    'border-purple-400', 'border-purple-500',
    'from-purple-500', 'to-purple-600',
    // Red (Boss Battle)
    'text-red-400', 'text-red-300', 'text-red-500',
    'bg-red-400', 'bg-red-500', 'bg-red-500/20', 'bg-red-900/30',
    'border-red-400', 'border-red-500',
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
        // Mobile-first: readable on small screens, scale up for desktop
        'xs': ['0.8rem', { lineHeight: '1.5' }],    // 12.8px — minimum readable
        'sm': ['0.9rem', { lineHeight: '1.6' }],     // 14.4px
        'base': ['1rem', { lineHeight: '1.7' }],     // 16px
        'lg': ['1.15rem', { lineHeight: '1.65' }],   // 18.4px
        'xl': ['1.35rem', { lineHeight: '1.6' }],    // 21.6px
        '2xl': ['1.65rem', { lineHeight: '1.5' }],   // 26.4px
        '3xl': ['2rem', { lineHeight: '1.4' }],      // 32px
        '4xl': ['2.5rem', { lineHeight: '1.3' }],    // 40px
        '5xl': ['3rem', { lineHeight: '1.2' }],      // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }],   // 60px
        '7xl': ['4.5rem', { lineHeight: '1.1' }],    // 72px
        '8xl': ['5.5rem', { lineHeight: '1' }],      // 88px
      },
      screens: {
        'xs': '375px',  // iPhone SE
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
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