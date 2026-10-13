/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        wine: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#a31d24',
          600: '#8a151b',
          700: '#700f14',
          800: '#540b0f',
          900: '#3c070a',
          950: '#260406',
          muted: '#c47c85',
        },
        gold: {
          50: '#fdfbf7',
          100: '#fbf5ea',
          200: '#f5e8cc',
          300: '#ebd3a3',
          400: '#deb874',
          500: '#c89b43',
          600: '#ad7e32',
          700: '#8c6027',
          800: '#724e23',
          900: '#5f401f',
        },
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#0f172a',
          600: '#1e293b',
          700: '#334155',
          800: '#0f172a',
          900: '#020617',
          950: '#020617',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        medical: {
          blue: '#0f172a',
          'blue-light': '#f1f5f9',
          'blue-soft': '#f8fafc',
          teal: '#c89b43',
          'teal-light': '#fbf5ea',
          leaf: '#0f172a',
          herb: '#c89b43'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'soft-xl': '0 20px 35px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 14px 30px -4px rgba(5, 150, 105, 0.12), 0 6px 12px -2px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out forwards',
        slideUp: 'slideUp 0.3s ease-out forwards',
        slideDown: 'slideDown 0.3s ease-out forwards',
        scaleIn: 'scaleIn 0.25s ease-out forwards',
        floatSlow: 'floatSlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
