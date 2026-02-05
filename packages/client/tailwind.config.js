/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep warm background tones
        canvas: {
          DEFAULT: '#121118',
          50: '#faf9f8',
          100: '#f0eeec',
          200: '#dedad6',
          300: '#c4bdb6',
          400: '#9a928a',
          500: '#706862',
          600: '#524b46',
          700: '#363230',
          800: '#1f1d1c',
          900: '#171615',
          950: '#121118',
        },
        // Primary brand - warm coral/terracotta
        brand: {
          DEFAULT: '#e07a5f',
          50: '#fdf6f4',
          100: '#fce8e3',
          200: '#f9d0c6',
          300: '#f3ab99',
          400: '#e9907a',
          500: '#e07a5f',
          600: '#c95d42',
          700: '#a84a34',
          800: '#8a3e2d',
          900: '#72352a',
        },
        // Success/online states
        success: {
          DEFAULT: '#6dbf8b',
          50: '#f0faf4',
          500: '#6dbf8b',
          600: '#4da870',
        },
        // Warm text hierarchy
        ink: {
          DEFAULT: '#ffffff',
          strong: '#faf8f6',
          base: '#e8e4e0',
          muted: '#a09890',
          faint: '#635c56',
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      backgroundImage: {
        // Warm gradient mesh
        'gradient-mesh': `
          radial-gradient(at 27% 37%, hsla(14, 68%, 55%, 0.12) 0px, transparent 50%),
          radial-gradient(at 97% 21%, hsla(25, 70%, 50%, 0.1) 0px, transparent 50%),
          radial-gradient(at 52% 99%, hsla(14, 68%, 62%, 0.08) 0px, transparent 50%),
          radial-gradient(at 10% 29%, hsla(30, 50%, 45%, 0.08) 0px, transparent 50%),
          radial-gradient(at 97% 96%, hsla(14, 60%, 50%, 0.06) 0px, transparent 50%),
          radial-gradient(at 33% 50%, hsla(20, 40%, 60%, 0.04) 0px, transparent 50%),
          radial-gradient(at 79% 53%, hsla(10, 50%, 55%, 0.04) 0px, transparent 50%)
        `,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scale-up': 'scaleUp 0.4s ease-out forwards',
        'slide-right': 'slideRight 0.4s ease-out forwards',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'flag-wave': 'flagWave 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        flagWave: {
          '0%, 100%': { transform: 'rotate(-5deg) scaleX(1)' },
          '50%': { transform: 'rotate(5deg) scaleX(0.95)' },
        },
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(224, 122, 95, 0.35)',
        'glow-lg': '0 0 60px -10px rgba(224, 122, 95, 0.45)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
