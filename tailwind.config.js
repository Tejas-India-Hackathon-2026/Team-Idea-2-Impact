/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF4F2',
          100: '#FBE8E4',
          200: '#F7D0C8',
          300: '#F0AA9A',
          400: '#E77C65',
          500: '#E05638', // Terracotta Primary
          600: '#C84327',
          700: '#A6331C',
          800: '#892D1B',
          900: '#72291B',
        },
        leaf: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981', // Fresh Leaf Green
          600: '#059669',
          700: '#047857',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
        sand: {
          50: '#FDFBF7',
          100: '#F8F5EE',
          200: '#EEE9DF',
          300: '#DDD5C5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'floating': '0 12px 32px -4px rgba(224, 86, 56, 0.18)',
        'card': '0 2px 12px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
