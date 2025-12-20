import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6F4E37', // Coffee brown
          dark: '#5C3D2E',
          light: '#8B6F47',
        },
        secondary: {
          DEFAULT: '#D4A574', // Light coffee
          dark: '#B8956A',
          light: '#E8C19A',
        },
        coffee: {
          50: '#F5F1EB',
          100: '#E8DDD0',
          200: '#D4C4B0',
          300: '#C0AB90',
          400: '#A68B6F',
          500: '#8B6F47',
          600: '#6F4E37',
          700: '#5C3D2E',
          800: '#4A3024',
          900: '#38231A',
        },
        border: {
          DEFAULT: '#E5E0D8',
          dark: '#D4C4B0',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config

