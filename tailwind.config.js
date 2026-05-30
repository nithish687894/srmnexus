/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#030712',
          bg: '#05050c',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          indigo: '#6366f1',
          neonCyan: '#00f3ff',
          neonViolet: '#bd00ff',
          glass: 'rgba(8, 8, 16, 0.4)',
          glassHover: 'rgba(12, 12, 24, 0.55)',
          glassBorder: 'rgba(255, 255, 255, 0.07)',
          grid: 'rgba(0, 243, 255, 0.04)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      backdropBlur: {
        cyber: '16px',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 243, 255, 0.25)',
        'violet-glow': '0 0 20px rgba(189, 0, 255, 0.25)',
        'card-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}
