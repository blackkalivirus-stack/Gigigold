/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Inter', 'sans-serif'],
      },
      colors: {
        // Overriding 'slate' with 'stone' values for a warmer, premium global aesthetic
        slate: {
          50: '#fafaf9',  // Warm Off-White
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917', // Warm Black
          950: '#0c0a09',
        },
        gold: {
          50: '#fffbea',
          100: '#fff1c2',
          200: '#ffe08a',
          300: '#ffc84d',
          400: '#ffaf1a',
          500: '#f59e0b', // Base Gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(245, 158, 11, 0.3)',
      }
    }
  },
  plugins: [],
}